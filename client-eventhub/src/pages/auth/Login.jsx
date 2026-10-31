import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = await login(email, password)
      if (user.role === "organizer") {
        navigate("/dashboard")
      } else {
        navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={page}>
      <form onSubmit={handleLogin} style={form}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        <button type="submit" style={btn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={text}>
          New user?{" "}
          <Link to="/register" style={link}>
            Register
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

export default Login