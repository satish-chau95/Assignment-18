const request = require("supertest")
const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const app = require("../server")
const User = require("../models/userModel")
const Task = require("../models/taskModel")

let mongoServer
let token
let userId

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)

  // Create a test user and get token
  const userRes = await request(app).post("/api/users/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  })

  token = userRes.body.token
  userId = userRes.body._id
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe("Task API", () => {
  beforeEach(async () => {
    await Task.deleteMany({})
  })

  it("should create a new task", async () => {
    const res = await request(app).post("/api/tasks").set("Authorization", `Bearer ${token}`).send({
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      priority: "medium",
    })

    expect(res.statusCode).toEqual(201)
    expect(res.body.title).toEqual("Test Task")
    expect(res.body.user).toEqual(userId)
  })

  it("should get all tasks for the user", async () => {
    // Create a task first
    await Task.create({
      user: userId,
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      priority: "medium",
    })

    const res = await request(app).get("/api/tasks").set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.length).toEqual(1)
    expect(res.body.data[0].title).toEqual("Test Task")
  })

  it("should update a task", async () => {
    // Create a task first
    const task = await Task.create({
      user: userId,
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      priority: "medium",
    })

    const res = await request(app).put(`/api/tasks/${task._id}`).set("Authorization", `Bearer ${token}`).send({
      title: "Updated Task",
      status: "in-progress",
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.title).toEqual("Updated Task")
    expect(res.body.status).toEqual("in-progress")
  })

  it("should delete a task", async () => {
    // Create a task first
    const task = await Task.create({
      user: userId,
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      priority: "medium",
    })

    const res = await request(app).delete(`/api/tasks/${task._id}`).set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)

    // Verify task is deleted
    const deletedTask = await Task.findById(task._id)
    expect(deletedTask).toBeNull()
  })
})
