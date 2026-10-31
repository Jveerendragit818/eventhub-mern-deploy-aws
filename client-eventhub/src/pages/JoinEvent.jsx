import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import events from "../data/events"

function JoinEvent() {
  const { id } = useParams()
  const navigate = useNavigate()

  const event = events.find(e => String(e.id) === String(id))

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  if (!event) {
    return <h2>Event Not Found</h2>
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    alert("Successfully Registered!")
    navigate(`/event/${event.id}`)
  }

  return (
    <div style={page}>
      <form onSubmit={handleSubmit} style={form}>
        <h2>Join {event.title}</h2>

        <input
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={input}
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={input}
        />

        <button
  style={btn}
  onClick={() => {
    alert("Event Added to My Schedule")
    navigate("/myschedule")
  }}
>
  Join Event
</button>
      </form>
    </div>
  )
}

/* 🎨 STYLES */

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f8fafc"
}

const form = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "350px"
}

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc"
}

const btn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px"
}

export default JoinEvent