import { useSelector } from "react-redux"

const TaskDebugInfo = () => {
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks)
  const { user } = useSelector((state) => state.auth)

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info (Development Only)</h3>
      <div className="text-xs text-yellow-700 space-y-1">
        <div>User ID: {user?._id || "Not logged in"}</div>
        <div>User Role: {user?.role || "Unknown"}</div>
        <div>Tasks Array: {Array.isArray(tasks) ? "Yes" : "No"}</div>
        <div>Tasks Count: {Array.isArray(tasks) ? tasks.length : "N/A"}</div>
        <div>Is Loading: {isLoading ? "Yes" : "No"}</div>
        <div>Is Error: {isError ? "Yes" : "No"}</div>
        <div>Error Message: {message || "None"}</div>
        <div>Tasks Data: {JSON.stringify(tasks, null, 2).substring(0, 200)}...</div>
      </div>
    </div>
  )
}

export default TaskDebugInfo
