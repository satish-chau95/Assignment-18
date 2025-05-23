const express = require("express")
const router = express.Router()
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskDocument,
} = require("../controllers/taskController")
const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")

router.route("/").get(protect, getTasks).post(protect, upload.array("documents", 3), createTask)

router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, upload.array("documents", 3), updateTask)
  .delete(protect, deleteTask)

router.get("/:id/documents/:docId", protect, getTaskDocument)

module.exports = router
