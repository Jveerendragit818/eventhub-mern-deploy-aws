import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav style={navStyle}>
      <h2 style={logo}>EventHub</h2>

      <div style={linkContainer}>
        {!user && (
          <Link to="/login" style={isActive("/login") ? activeLink : linkStyle}>
            Login
          </Link>
        )}

        {user && user.role === "attendee" && (
          <>
            <Link to="/" style={isActive("/") ? activeLink : linkStyle}>
              Home
            </Link>
            <Link to="/myschedule" style={isActive("/myschedule") ? activeLink : linkStyle}>
              My Schedule
            </Link>
          </>
        )}

        {user && user.role === "organizer" && (
          <>
            <Link to="/dashboard" style={isActive("/dashboard") ? activeLink : linkStyle}>
              Dashboard
            </Link>
            <Link to="/create" style={isActive("/create") ? activeLink : linkStyle}>
              Create Event
            </Link>
          </>
        )}

        {user && (
          <div style={{ position: "relative" }}>
            <div onClick={() => setOpen(!open)} style={avatar}>
              {user.email ? user.email[0].toUpperCase() : "U"}
            </div>

            {open && (
              <div style={dropdown}>
                <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#333" }}>
                  {user.email}
                </p>
                <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#6b7280" }}>
                  Role: {user.role}
                </p>
                <button onClick={logout} style={logoutBtn}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

const navStyle = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  padding: "15px 30px",
  background: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
}

const logo = { color: "#2563eb", margin: 0 }

const linkContainer = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
}

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontWeight: "500",
}

const activeLink = {
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: "600",
  borderBottom: "2px solid #2563eb",
  paddingBottom: "2px",
}

const avatar = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  background: "#2563eb",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontWeight: "bold",
}

const dropdown = {
  position: "absolute",
  top: "45px",
  right: 0,
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  minWidth: "180px",
  zIndex: 200,
}

const logoutBtn = {
  width: "100%",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
}

export default Navbar