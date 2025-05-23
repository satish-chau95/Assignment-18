import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../../config"

const initialState = {
  users: [],
  user: null,
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

// Get all users (admin only)
export const getUsers = createAsyncThunk("users/getAll", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    const response = await authAxios.get("/api/users")
    return response.data
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get user by ID
export const getUserById = createAsyncThunk("users/getById", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    const response = await authAxios.get(`/api/users/${id}`)
    return response.data
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Create new user (admin only)
export const createUser = createAsyncThunk("users/create", async (userData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    const response = await authAxios.post("/api/users", userData)
    return response.data
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Update user
export const updateUser = createAsyncThunk("users/update", async ({ id, userData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    const response = await authAxios.put(`/api/users/${id}`, userData)
    return response.data
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Delete user (admin only)
export const deleteUser = createAsyncThunk("users/delete", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const authAxios = createAuthAxios(token)

    await authAxios.delete(`/api/users/${id}`)

    return id
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
    clearUser: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = action.payload
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = state.users.map((user) => (user._id === action.payload._id ? action.payload : user))
        state.user = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = state.users.filter((user) => user._id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, clearUser } = userSlice.actions
export default userSlice.reducer
