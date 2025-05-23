"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getTaskById, updateTask, deleteTask, clearTask } from "../redux/slices/taskSlice"
import { getUsers } from "../redux/slices/userSlice"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import TaskForm from "../components/TaskForm"
import { format } from "date-fns"
import { API_URL } from "../config"

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { task, isLoading, isError, message } = useSelector((state) => state.tasks)
  const { users } = useSelector((state) => state.users)
  const { user } = useSelector((state) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    const fetchData = async () => {
      try {
        await dispatch(getTaskById(id)).unwrap()

        if (user && user.role === "admin") {
          await dispatch(getUsers()).unwrap()
        }
      } catch (error) {
        console.error("Error fetching task details:", error)
        toast.error("Failed to load task details")
      }
    }

    fetchData()

    return () => {
      dispatch(clearTask())
    }
  }, [dispatch, id, isError, message, user])

  const handleUpdateTask = async (taskData) => {
    setIsSubmitting(true)
    try {
      await dispatch(updateTask({ id, taskData })).unwrap()
      toast.success("Task updated successfully")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error(error || "Failed to update task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(id)).unwrap()
        toast.success("Task deleted successfully")
        navigate("/")
      } catch (error) {
        console.error("Error deleting task:", error)
        toast.error(error || "Failed to delete task")
      }
    }
  }

  // Check if the current user can edit this task
  const canEdit = user && task && (user.role === "admin" || task.user === user._id)

  if (isLoading || !task) {
    return <Spinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Details</h1>
        <div className="space-x-2">
          {canEdit && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                {isEditing ? "Cancel" : "Edit Task"}
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                Delete Task
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
          <TaskForm task={task} onSubmit={handleUpdateTask} users={users} />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-500">
                Created on {task.createdAt ? format(new Date(task.createdAt), "MMM d, yyyy") : "Unknown date"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Unknown"} Priority
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status
                  ? task.status.charAt(0).toUpperCase() + task.status.slice(1).replace(/-/g, " ")
                  : "Unknown"}
              </span>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium">
                    {task.assignedTo
                      ? typeof task.assignedTo === "object"
                        ? task.assignedTo.name
                        : "Unknown User"
                      : "Unassigned"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
                  </p>
                </div>
              </div>
            </div>

            {task.documents && task.documents.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Documents</h3>
                <ul className="space-y-2">
                  {task.documents.map((doc, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href={`${API_URL}/api/tasks/${task._id}/documents/${doc._id || doc.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {doc.originalname || doc.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskDetails
