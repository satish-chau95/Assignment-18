const asyncHandler = require("express-async-handler")
const Task = require("../models/taskModel")
const fs = require("fs")
const path = require("path")

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  try {
    // Build query
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"]

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    // Create query string
    let queryStr = JSON.stringify(reqQuery)

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    // Finding resource
    if (req.user.role === "admin") {
      // Admin can see all tasks
      query = Task.find(JSON.parse(queryStr))
    } else {
      // Regular users can only see their own tasks or tasks assigned to them
      query = Task.find({
        $or: [{ user: req.user.id }, { assignedTo: req.user.id }],
        ...JSON.parse(queryStr),
      })
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    // Populate
    query = query
      .populate({
        path: "assignedTo",
        select: "name email",
      })
      .populate({
        path: "user",
        select: "name email",
      })

    // Executing query
    const tasks = await query

    console.log(`Returning ${tasks.length} tasks for user ${req.user.id}`)

    // Return tasks as a simple array
    res.status(200).json(tasks)
  } catch (error) {
    console.error("Error in getTasks:", error)
    res.status(500).json({ message: error.message })
  }
})

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate({
      path: "assignedTo",
      select: "name email",
    })

    if (!task) {
      res.status(404)
      throw new Error("Task not found")
    }

    // Check if user is authorized to view this task
    if (
      req.user.role !== "admin" &&
      task.user.toString() !== req.user.id &&
      (!task.assignedTo || task.assignedTo._id.toString() !== req.user.id)
    ) {
      res.status(403)
      throw new Error("Not authorized to view this task")
    }

    res.status(200).json(task)
  } catch (error) {
    console.error("Error in getTaskById:", error)
    res.status(error.statusCode || 500).json({ message: error.message })
  }
})

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  try {
    req.body.user = req.user.id

    // Handle file uploads
    const documents = []
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        documents.push({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path,
        })
      })
    }

    // Create task
    const task = await Task.create({
      ...req.body,
      documents,
    })

    // Populate the assignedTo field if it exists
    if (task.assignedTo) {
      await task.populate({
        path: "assignedTo",
        select: "name email",
      })
    }

    console.log("Task created:", task)
    res.status(201).json(task)
  } catch (error) {
    console.error("Error in createTask:", error)
    res.status(400).json({ message: error.message })
  }
})

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  try {
    let task = await Task.findById(req.params.id)

    if (!task) {
      res.status(404)
      throw new Error("Task not found")
    }

    // Check if user is authorized to update this task
    if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
      res.status(403)
      throw new Error("Not authorized to update this task")
    }

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      // Remove old files if they exist
      if (task.documents && task.documents.length > 0) {
        task.documents.forEach((doc) => {
          try {
            fs.unlinkSync(doc.path)
          } catch (err) {
            console.error("Error deleting file:", err)
          }
        })
      }

      // Add new files
      const documents = []
      req.files.forEach((file) => {
        documents.push({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path,
        })
      })
      req.body.documents = documents
    }

    // Update task
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: "assignedTo",
      select: "name email",
    })

    console.log("Task updated:", task)
    res.status(200).json(task)
  } catch (error) {
    console.error("Error in updateTask:", error)
    res.status(error.statusCode || 500).json({ message: error.message })
  }
})

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      res.status(404)
      throw new Error("Task not found")
    }

    // Check if user is authorized to delete this task
    if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
      res.status(403)
      throw new Error("Not authorized to delete this task")
    }

    // Delete associated files
    if (task.documents && task.documents.length > 0) {
      task.documents.forEach((doc) => {
        try {
          fs.unlinkSync(doc.path)
        } catch (err) {
          console.error("Error deleting file:", err)
        }
      })
    }

    await Task.deleteOne({ _id: task._id })

    res.status(200).json({ id: req.params.id })
  } catch (error) {
    console.error("Error in deleteTask:", error)
    res.status(error.statusCode || 500).json({ message: error.message })
  }
})

// @desc    Get task document
// @route   GET /api/tasks/:id/documents/:docId
// @access  Private
const getTaskDocument = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      res.status(404)
      throw new Error("Task not found")
    }

    // Check if user is authorized to view this task
    if (
      req.user.role !== "admin" &&
      task.user.toString() !== req.user.id &&
      (!task.assignedTo || task.assignedTo.toString() !== req.user.id)
    ) {
      res.status(403)
      throw new Error("Not authorized to view this task")
    }

    // Find the document
    const document = task.documents.find(
      (doc) => doc._id.toString() === req.params.docId || doc.filename === req.params.docId,
    )

    if (!document) {
      res.status(404)
      throw new Error("Document not found")
    }

    // Send the file
    res.sendFile(path.resolve(document.path))
  } catch (error) {
    console.error("Error in getTaskDocument:", error)
    res.status(error.statusCode || 500).json({ message: error.message })
  }
})

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskDocument,
}
