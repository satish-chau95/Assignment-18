const request = require("supertest")
const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const app = require("../server")
const User = require("../models/userModel")

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe("User API", () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  it("should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    })

    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty("token")
    expect(res.body.name).toEqual("Test User")
    expect(res.body.email).toEqual("test@example.com")
  })

  it("should login a user", async () => {
    // Create a user first
    await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    })

    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("token")
  })

  it("should not login with invalid credentials", async () => {
    // Create a user first
    await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    })

    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    })

    expect(res.statusCode).toEqual(401)
  })
})
