const mongoose = require("mongoose")
const dotenv = require("dotenv")
const colors = require("colors")

// Load env vars
dotenv.config()

// Models
const Task = require("../models/taskModel")
const User = require("../models/userModel")

// Connect to database
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...")
    console.log("MongoDB URI:", process.env.MONGO_URI)

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    return conn
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

const listTasks = async () => {
  try {
    const tasks = await Task.find().populate("user assignedTo")
    console.log(`Found ${tasks.length} tasks:`.green)

    tasks.forEach((task, index) => {
      console.log(`\nTask ${index + 1}:`.yellow)
      console.log(`ID: ${task._id}`)
      console.log(`Title: ${task.title}`)
      console.log(`Status: ${task.status}`)
      console.log(`Created by: ${task.user ? task.user.name : "Unknown"} (${task.user ? task.user._id : "Unknown"})`)
      console.log(`Assigned to: ${task.assignedTo ? task.assignedTo.name : "Unassigned"}`)
    })
  } catch (error) {
    console.error(`Error listing tasks: ${error.message}`.red)
  }
}

const listUsers = async () => {
  try {
    const users = await User.find()
    console.log(`\nFound ${users.length} users:`.green)

    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`.yellow)
      console.log(`ID: ${user._id}`)
      console.log(`Name: ${user.name}`)
      console.log(`Email: ${user.email}`)
      console.log(`Role: ${user.role}`)
    })
  } catch (error) {
    console.error(`Error listing users: ${error.message}`.red)
  }
}

const main = async () => {
  const conn = await connectDB()

  await listUsers()
  await listTasks()

  console.log("\nDatabase check complete.".green)
  mongoose.disconnect()
}

main()
