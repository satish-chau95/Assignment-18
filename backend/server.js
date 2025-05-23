const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const cors = require("cors")
const { errorHandler } = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")
const path = require("path")

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "API is running..." })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})

module.exports = app
