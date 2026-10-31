import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>

  if (!user) return <Navigate to="/login" />

  if (role && user.role !== role) return <Navigate to="/login" />

  return children
}

export default ProtectedRoute