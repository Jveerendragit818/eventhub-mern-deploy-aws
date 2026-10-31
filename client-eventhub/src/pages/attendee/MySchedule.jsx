import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import API from "../../utils/api"

function MySchedule() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await API.get("/events/my/schedule")
        setEvents(res.data)
      } catch (err) {
        console.error("Failed to fetch schedule:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  if (loading) return <p style={{ padding: "30px" }}>Loading your schedule...</p>

  return (
    <div style={page}>
      <h2 style={{ marginBottom: "20px" }}>My Schedule</h2>

      {events.length === 0 ? (
        <div style={emptyBox}>
          <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "15px" }}>
            You have not joined any events yet.
          </p>
          <Link to="/">
            <button style={primaryBtn}>Browse Events</button>
          </Link>
        </div>
      ) : (
        <div style={grid}>
          {events.map((event) => (
            <div key={event._id} style={card}>
              <img
                src={event.image || "https://via.placeholder.com/400x200"}
                alt={event.title}
                style={imgStyle}
              />
              <div style={{ padding: "15px" }}>
                <h3>{event.title}</h3>
                <p style={infoText}>📅 {event.date}</p>
                <p style={infoText}>📍 {event.location}</p>
                <div style={{ marginTop: "10px" }}>
                  <Link to={`/event/${event._id}`} style={{ textDecoration: "none" }}>
                    <button style={primaryBtn}>View</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const page = { padding: "30px", background: "#f8fafc", minHeight: "100vh" }
const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }
const card = { background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
const imgStyle = { width: "100%", height: "160px", objectFit: "cover" }
const infoText = { fontSize: "14px", color: "#555" }
const primaryBtn = { background: "#2563eb", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }
const emptyBox = { textAlign: "center", padding: "60px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }

export default MySchedule