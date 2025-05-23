const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error("Please provide all required fields")
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: user.getSignedJwtToken(),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validation
  if (!email || !password) {
    res.status(400)
    throw new Error("Please provide email and password")
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    res.status(401)
    throw new Error("Invalid credentials")
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    res.status(401)
    throw new Error("Invalid credentials")
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: user.getSignedJwtToken(),
  })
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
  res.status(200).json(users)
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Check if user is authorized to view this user
  if (req.user.role !== "admin" && req.user.id !== req.params.id) {
    res.status(403)
    throw new Error("Not authorized to view this user")
  }

  res.status(200).json(user)
})

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error("Please provide all required fields")
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Check if user is authorized to update this user
  if (req.user.role !== "admin" && req.user.id !== req.params.id) {
    res.status(403)
    throw new Error("Not authorized to update this user")
  }

  // Only admin can update role
  if (req.body.role && req.user.role !== "admin") {
    delete req.body.role
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  res.status(200).json(updatedUser)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  await user.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
