import { Link } from "react-router-dom"
import { format } from "date-fns"

const TaskItem = ({ task }) => {
  // Safety check for task data
  if (!task || !task._id) {
    console.error("Invalid task data:", task)
    return null
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format the status for display
  const formatStatus = (status) => {
    if (!status) return "Unknown"
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ")
  }

  // Safe date formatting
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "No date"
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  return (
    <Link
      to={`/tasks/${task._id}`}
      className="block border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 bg-white hover:bg-gray-50 hover:border-indigo-300 group"
    >
      {/* Header with title and badges */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex flex-col space-y-1 ml-3">
          {task.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          )}
          {task.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
              {formatStatus(task.status)}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>

      {/* Footer with metadata */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>
            {task.assignedTo
              ? typeof task.assignedTo === "object" && task.assignedTo?.name
                ? task.assignedTo.name
                : "Assigned"
              : "Unassigned"}
          </span>
        </div>

        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>

      {/* Documents indicator */}
      {task.documents && task.documents.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className="flex items-center text-xs text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            {task.documents.length} document{task.documents.length !== 1 ? "s" : ""} attached
          </span>
        </div>
      )}

      {/* Edit indicator */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <span className="text-xs text-indigo-600 group-hover:text-indigo-700 font-medium">
          Click to view and edit →
        </span>
      </div>
    </Link>
  )
}

export default TaskItem
