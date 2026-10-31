import { useState, useEffect } from "react"
import EventCard from "../../components/EventCard"
import SearchBar from "../../components/SearchBar"
import CategoryFilter from "../../components/CategoryFilter"
import API from "../../utils/api"

function AttendeeHome() {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
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

  const filteredEvents = events.filter((e) => {
    return (
      e.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || e.category === category)
    )
  })

  if (loading) return <p style={{ padding: "30px" }}>Loading events...</p>

  return (
    <div style={page}>
      <h2 style={{ marginBottom: "20px" }}>Explore Events</h2>

      <SearchBar onSearch={setSearch} />
      <CategoryFilter selected={category} setSelected={setCategory} />

      <div style={container}>
        <div style={grid}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <p style={{ color: "#6b7280" }}>No events found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

const page = { padding: "30px", background: "#f8fafc", minHeight: "100vh" }
const container = { maxWidth: "1400px", margin: "0 auto" }
const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "25px" }

export default AttendeeHome