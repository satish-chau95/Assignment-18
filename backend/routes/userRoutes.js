const express = require("express")
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController")
const { protect, admin } = require("../middleware/authMiddleware")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/", protect, admin, getUsers)
router.post("/", protect, admin, createUser)
router.get("/:id", protect, getUserById)
router.put("/:id", protect, updateUser)
router.delete("/:id", protect, admin, deleteUser)

module.exports = router
