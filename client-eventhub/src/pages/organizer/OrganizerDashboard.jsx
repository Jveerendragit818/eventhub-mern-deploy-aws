import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import API from "../../utils/api"

function OrganizerDashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events")
        setEvents(res.data)
      } catch (err) {
        console.error("Failed to fetch events:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return
    try {
      await API.delete(`/events/${id}`)
      setEvents(events.filter((e) => e._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete")
    }
  }

  const totalRegistrations = events.reduce((sum, e) => sum + (e.registered || 0), 0)

  if (loading) return <p style={{ padding: "30px" }}>Loading dashboard...</p>

  return (
    <div style={page}>
      <h2 style={{ marginBottom: "25px" }}>Organizer Dashboard</h2>

      <div style={statsContainer}>
        <div style={statCard}>
          <h2 style={{ color: "#2563eb", margin: 0 }}>{events.length}</h2>
          <p style={{ color: "#6b7280", marginTop: "5px" }}>Total Events</p>
        </div>
        <div style={statCard}>
          <h2 style={{ color: "#10b981", margin: 0 }}>{totalRegistrations}</h2>
          <p style={{ color: "#6b7280", marginTop: "5px" }}>Total Registrations</p>
        </div>
      </div>

      <div style={chartCard}>
        <h3 style={{ marginBottom: "15px" }}>Registration Overview</h3>
        {events.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>No events to display.</p>
        )}
        {events.map((event) => {
          const percent = event.maxCapacity
            ? Math.min(Math.round((event.registered / event.maxCapacity) * 100), 100)
            : 0
          return (
            <div key={event._id} style={{ marginBottom: "12px" }}>
              <div style={chartLabel}>
                <span style={{ fontSize: "14px" }}>{event.title}</span>
                <span style={{ fontSize: "14px" }}>
                  {event.registered}/{event.maxCapacity}
                </span>
              </div>
              <div style={barBg}>
                <div style={{ ...barFill, width: `${percent}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/create" style={{ textDecoration: "none" }}>
          <button style={createBtn}>+ Create Event</button>
        </Link>
      </div>

      <div style={eventList}>
        {events.length === 0 && (
          <p style={{ color: "#6b7280" }}>No events yet. Create one!</p>
        )}
        {events.map((event) => (
          <div key={event._id} style={eventCard} className="event-card">
            <div>
              <h3 style={{ margin: "0 0 5px 0" }}>{event.title}</h3>
              <p style={subText}>📅 {event.date}</p>
              <p style={subText}>
                👥 {event.registered} / {event.maxCapacity} Registered
              </p>
              <p style={subText}>📍 {event.location}</p>
            </div>

            <div style={btnGroup}>
              <Link to={`/edit/${event._id}`}>
                <button style={editBtn}>Edit</button>
              </Link>
              <button style={deleteBtn} onClick={() => handleDelete(event._id)}>
                Delete
              </button>
            </div>

            <style>{`
              .event-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
              }
            `}</style>
          </div>
        ))}
      </div>
    </div>
  )
}

const page = { padding: "30px", background: "#f8fafc", minHeight: "100vh" }
const statsContainer = { display: "flex", gap: "20px", marginBottom: "25px" }
const statCard = { flex: 1, background: "#fff", padding: "25px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", textAlign: "center" }
const chartCard = { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "25px" }
const chartLabel = { display: "flex", justifyContent: "space-between", marginBottom: "5px" }
const barBg = { height: "10px", background: "#e5e7eb", borderRadius: "5px" }
const barFill = { height: "100%", background: "#2563eb", borderRadius: "5px", transition: "0.4s" }
const createBtn = { background: "#2563eb", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "500", cursor: "pointer", marginBottom: "20px" }
const eventList = { display: "flex", flexDirection: "column", gap: "15px" }
const eventCard = { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "18px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", transition: "0.3s" }
const subText = { fontSize: "14px", color: "#6b7280", margin: "2px 0" }
const btnGroup = { display: "flex", gap: "10px" }
const editBtn = { background: "#f59e0b", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }
const deleteBtn = { background: "#ef4444", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }

export default OrganizerDashboard