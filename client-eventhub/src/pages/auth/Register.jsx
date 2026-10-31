import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("attendee")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await register(email, password, role)
      alert("Registered successfully! Please login.")
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={page}>
      <form onSubmit={handleRegister} style={form}>
        <h2 style={{ marginBottom: "20px" }}>Register</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={input}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={input}
        >
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>

        <button type="submit" style={btn} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={text}>
          Already have an account?{" "}
          <Link to="/login" style={link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

const page = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f8fafc", padding: "20px" }
const form = { background: "#fff", padding: "30px", borderRadius: "14px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column" }
const input = { padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }
const btn = { background: "#2563eb", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginBottom: "10px" }
const text = { fontSize: "14px", textAlign: "center" }
const link = { color: "#2563eb", textDecoration: "none", fontWeight: "500" }
const errorStyle = { background: "#fef2f2", color: "#dc2626", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }

export default Register