import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../../config"

const initialState = {
  tasks: [],
  task: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

// Create axios instance with auth header
const createAuthAxios = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Get all tasks
export const getTasks = createAsyncThunk("tasks/getAll", async (filters, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    let url = "/api/tasks"
    if (filters) {
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append("status", filters.status)
      if (filters.priority) queryParams.append("priority", filters.priority)
      if (filters.dueDate) queryParams.append("dueDate", filters.dueDate)
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy)
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder)
      if (filters.page) queryParams.append("page", filters.page)
      if (filters.limit) queryParams.append("limit", filters.limit)

      url = `${url}?${queryParams.toString()}`
    }

    console.log("Fetching tasks from:", url)
    const response = await authAxios.get(url)
    console.log("API Response:", response.data)

    // Ensure we always return an array
    const tasks = Array.isArray(response.data) ? response.data : []
    console.log("Processed tasks:", tasks)

    return tasks
  } catch (error) {
    console.error("Error fetching tasks:", error)
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get task by ID
export const getTaskById = createAsyncThunk("tasks/getById", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    const response = await authAxios.get(`/api/tasks/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching task by ID:", error)
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Create new task
export const createTask = createAsyncThunk("tasks/create", async (taskData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    // Handle file uploads with FormData
    const formData = new FormData()
    formData.append("title", taskData.title)
    formData.append("description", taskData.description)
    formData.append("status", taskData.status)
    formData.append("priority", taskData.priority)

    if (taskData.dueDate) {
      formData.append("dueDate", taskData.dueDate)
    }

    if (taskData.assignedTo) {
      formData.append("assignedTo", taskData.assignedTo)
    }

    // Append documents if they exist
    if (taskData.documents && taskData.documents.length > 0) {
      for (let i = 0; i < taskData.documents.length; i++) {
        formData.append("documents", taskData.documents[i])
      }
    }

    console.log("Creating task with data:", {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      assignedTo: taskData.assignedTo,
      documentsCount: taskData.documents ? taskData.documents.length : 0,
    })

    const response = await authAxios.post("/api/tasks", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Task created response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error creating task:", error)
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Update task
export const updateTask = createAsyncThunk("tasks/update", async ({ id, taskData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    // Handle file uploads with FormData
    const formData = new FormData()
    formData.append("title", taskData.title)
    formData.append("description", taskData.description)
    formData.append("status", taskData.status)
    formData.append("priority", taskData.priority)

    if (taskData.dueDate) {
      formData.append("dueDate", taskData.dueDate)
    }

    if (taskData.assignedTo) {
      formData.append("assignedTo", taskData.assignedTo)
    }

    // Append documents if they exist
    if (taskData.documents && taskData.documents.length > 0) {
      for (let i = 0; i < taskData.documents.length; i++) {
        formData.append("documents", taskData.documents[i])
      }
    }

    console.log("Updating task with ID:", id)
    const response = await authAxios.put(`/api/tasks/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Task updated response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error updating task:", error)
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Delete task
export const deleteTask = createAsyncThunk("tasks/delete", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    await authAxios.delete(`/api/tasks/${id}`)
    console.log("Task deleted with ID:", id)
    return id
  } catch (error) {
    console.error("Error deleting task:", error)
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
    clearTask: (state) => {
      state.task = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        // Ensure we always have an array
        state.tasks = Array.isArray(action.payload) ? action.payload : []
        console.log("Tasks stored in Redux:", state.tasks.length)
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.task = action.payload
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        // Ensure tasks is an array before adding
        if (!Array.isArray(state.tasks)) {
          state.tasks = []
        }
        // Add the new task to the beginning of the array
        state.tasks.unshift(action.payload)
        console.log("Task added to Redux store. Total tasks:", state.tasks.length)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        if (Array.isArray(state.tasks)) {
          state.tasks = state.tasks.map((task) => (task._id === action.payload._id ? action.payload : task))
        }
        state.task = action.payload
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        if (Array.isArray(state.tasks)) {
          state.tasks = state.tasks.filter((task) => task._id !== action.payload)
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, clearTask } = taskSlice.actions
export default taskSlice.reducer
