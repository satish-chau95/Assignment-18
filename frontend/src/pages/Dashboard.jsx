"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getTasks, reset, createTask } from "../redux/slices/taskSlice"
import { getUsers } from "../redux/slices/userSlice"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import TaskItem from "../components/TaskItem"
import TaskForm from "../components/TaskForm"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks)
  const { users } = useSelector((state) => state.users)

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dueDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  // Force re-fetch tasks when component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log("Dashboard mounted, fetching tasks for user:", user._id)
      dispatch(getTasks(filters))

      if (user.role === "admin") {
        dispatch(getUsers())
      }
    }
  }, [filters, dispatch, user])

  // Handle filter changes
  useEffect(() => {
    if (user) {
      console.log("Filters changed, refetching tasks:", filters)
      dispatch(getTasks(filters))
    }
  }, [filters, dispatch, user])

  // Handle errors
  useEffect(() => {
    if (isError) {
      toast.error(message)
      dispatch(reset())
    }
  }, [isError, message, dispatch])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true)
    try {
      console.log("Creating task with data:", taskData)
      const result = await dispatch(createTask(taskData)).unwrap()
      console.log("Task created successfully:", result)
      toast.success("Task created successfully!")
      setShowTaskForm(false)

      // Immediately refresh the tasks list to ensure the new task appears
      await dispatch(getTasks({})).unwrap()
      console.log("Tasks refreshed after creation")
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error(typeof error === "string" ? error : "Failed to create task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const refreshTasks = async () => {
    try {
      console.log("Manually refreshing tasks...")
      await dispatch(getTasks({})).unwrap()
      toast.success("Tasks refreshed successfully!")
    } catch (error) {
      console.error("Error refreshing tasks:", error)
      toast.error("Failed to refresh tasks")
    }
  }

  // Debug logging
  console.log("Dashboard render - Tasks:", tasks)
  console.log("Dashboard render - Tasks length:", Array.isArray(tasks) ? tasks.length : "Not an array")
  console.log("Dashboard render - Is loading:", isLoading)

  if (isLoading && (!tasks || tasks.length === 0)) {
    return <Spinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {user?.name}! You have {Array.isArray(tasks) ? tasks.length : 0} task(s).
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={refreshTasks}
            disabled={isLoading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {showTaskForm ? "Cancel" : "Create Task"}
          </button>
        </div>
      </div>

      {/* Task Creation Form */}
      {showTaskForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Create New Task</h2>
          <TaskForm onSubmit={handleCreateTask} users={users} />
          {isSubmitting && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                <span className="text-sm text-gray-600">Creating task...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Display */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {Array.isArray(tasks) ? `${tasks.length} task(s) found` : "Loading tasks..."}
            </span>
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>}
          </div>
        </div>

        {Array.isArray(tasks) && tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">
              {Array.isArray(tasks)
                ? "You haven't created any tasks yet. Create your first task to get started!"
                : "Loading your tasks..."}
            </p>
            {Array.isArray(tasks) && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Your First Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
