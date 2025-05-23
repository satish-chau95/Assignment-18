"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getUsers, createUser, updateUser, deleteUser, reset } from "../redux/slices/userSlice"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import UserForm from "../components/UserForm"

const UserManagement = () => {
  const dispatch = useDispatch()
  const { users, isLoading, isError, message } = useSelector((state) => state.users)

  const [showUserForm, setShowUserForm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(getUsers())

    return () => {
      dispatch(reset())
    }
  }, [dispatch, isError, message])

  const handleCreateUser = (userData) => {
    dispatch(createUser(userData))
      .unwrap()
      .then(() => {
        toast.success("User created successfully")
        setShowUserForm(false)
        dispatch(getUsers())
      })
      .catch((error) => {
        toast.error(error)
      })
  }

  const handleUpdateUser = (userData) => {
    dispatch(updateUser({ id: currentUser._id, userData }))
      .unwrap()
      .then(() => {
        toast.success("User updated successfully")
        setShowUserForm(false)
        setCurrentUser(null)
        dispatch(getUsers())
      })
      .catch((error) => {
        toast.error(error)
      })
  }

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => {
          toast.success("User deleted successfully")
          dispatch(getUsers())
        })
        .catch((error) => {
          toast.error(error)
        })
    }
  }

  const handleEditUser = (user) => {
    setCurrentUser(user)
    setShowUserForm(true)
  }

  const handleCancelForm = () => {
    setShowUserForm(false)
    setCurrentUser(null)
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => {
            setCurrentUser(null)
            setShowUserForm(!showUserForm)
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          {showUserForm && !currentUser ? "Cancel" : "Create User"}
        </button>
      </div>

      {showUserForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{currentUser ? "Edit User" : "Create New User"}</h2>
          <UserForm user={currentUser} onSubmit={currentUser ? handleUpdateUser : handleCreateUser} />
          {currentUser && (
            <div className="mt-4 flex justify-end">
              <button onClick={handleCancelForm} className="text-gray-600 hover:text-gray-800">
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  )
}

export default UserManagement
