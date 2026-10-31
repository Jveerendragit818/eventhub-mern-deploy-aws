/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react"
import API from "../utils/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const register = async (email, password, role) => {
    const res = await API.post("/auth/register", { email, password, role })
    return res.data
  }

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password })
    const { token, user } = res.data
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)