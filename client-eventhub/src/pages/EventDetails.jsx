import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { downloadICS } from "../utils/calendar"
import { useAuth } from "../context/AuthContext"
import CommentSection from "../components/CommentSection"
import API from "../utils/api"

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [event, setEvent] = useState(null)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [liked, setLiked] = useState(false)
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`)
        setEvent(res.data)
        setSelectedImage(res.data.image)

        if (user && res.data.registeredUsers?.includes(user.id)) {
          setJoined(true)
        }

        const allRes = await API.get("/events")
        const related = allRes.data.filter(
          (e) => e.category === res.data.category && e._id !== id
        )
        setRelatedEvents(related)
      } catch (err) {
        console.error("Failed to fetch event:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id, user])

  const handleJoin = async () => {
    if (joined || !event) return
    try {
      await API.post(`/events/${id}/join`)
      setJoined(true)
      setEvent((prev) => ({ ...prev, registered: prev.registered + 1 }))
      alert("Successfully joined! Redirecting to My Schedule...")
      navigate("/myschedule")
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join")
    }
  }

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>
  if (!event) return <h2 style={{ padding: "20px" }}>Event Not Found</h2>

  const isFull = event.registered >= event.maxCapacity

  // All images: cover + extras for gallery
  const allImages = [
    event.image,
    ...(event.extraImages || []),
  ].filter(Boolean)

  return (
    <div style={page}>

      {/* ✅ HERO IMAGE (clickable selected image) */}
      <div style={heroContainer}>
        <img src={selectedImage || event.image} alt={event.title} style={heroImage} />
        <div style={overlay}>
          <h1 style={titleStyle}>{event.title}</h1>
          <p style={subtitle}>{event.category}</p>
        </div>
      </div>

      {/* ✅ IMAGE GALLERY THUMBNAILS */}
      {allImages.length > 1 && (
        <div style={galleryContainer}>
          {allImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`gallery-${index}`}
              onClick={() => setSelectedImage(src)}
              style={{
                ...thumbStyle,
                border: selectedImage === src
                  ? "3px solid #2563eb"
                  : "3px solid transparent",
              }}
            />
          ))}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={contentWrapper}>

        {/* LEFT: EVENT DETAILS */}
        <div style={card}>
          <h2>Event Details</h2>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p style={{ marginTop: "10px" }}>{event.description}</p>
          <p style={{ marginTop: "10px" }}>
            <strong>Seats:</strong> {event.registered}/{event.maxCapacity}
          </p>

          <div style={{ marginTop: "15px" }}>
            <button
              style={{
                ...primaryBtn,
                background: joined ? "#10b981" : isFull ? "#9ca3af" : "#2563eb",
                cursor: joined || isFull ? "not-allowed" : "pointer",
              }}
              onClick={handleJoin}
              disabled={joined || isFull}
            >
              {isFull ? "Event Full" : joined ? "Joined ✓" : "Join Event"}
            </button>

            <button style={secondaryBtn} onClick={() => setLiked(!liked)}>
              {liked ? "❤️ Liked" : "🤍 Like"}
            </button>

            <button style={secondaryBtn} onClick={() => downloadICS(event)}>
              Add to Calendar
            </button>
          </div>
        </div>

        {/* RIGHT: COMMENTS */}
        <div style={card}>
          <h3>Discussion</h3>
          <CommentSection />
        </div>
      </div>

      {/* RELATED EVENTS */}
      {relatedEvents.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ marginBottom: "15px" }}>Related Events</h2>
          <div style={scrollContainer}>
            {relatedEvents.map((e) => (
              <Link
                key={e._id}
                to={`/event/${e._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={relatedCard}>
                  <img src={e.image} alt={e.title} style={relatedImg} />
                  <div style={{ padding: "10px" }}>
                    <h4>{e.title}</h4>
                    <p style={{ fontSize: "13px", color: "#666" }}>{e.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const page = { padding: "20px 30px", background: "#f8fafc", minHeight: "100vh" }
const heroContainer = { position: "relative", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }
const heroImage = { width: "100%", height: "360px", objectFit: "cover" }
const overlay = { position: "absolute", bottom: "20px", left: "20px", color: "#fff" }
const titleStyle = { margin: 0, fontSize: "28px", textShadow: "0 2px 6px rgba(0,0,0,0.5)" }
const subtitle = { margin: 0, fontSize: "16px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }

const galleryContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  overflowX: "auto",
  paddingBottom: "6px",
}

const thumbStyle = {
  width: "90px",
  height: "65px",
  objectFit: "cover",
  borderRadius: "8px",
  cursor: "pointer",
  flexShrink: 0,
  transition: "border 0.2s",
}

const contentWrapper = { display: "flex", gap: "20px", flexWrap: "wrap" }
const card = { flex: 1, background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
const primaryBtn = { color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px", marginRight: "10px" }
const secondaryBtn = { background: "#e5e7eb", border: "none", padding: "10px 15px", borderRadius: "6px", marginRight: "10px", cursor: "pointer" }
const scrollContainer = { display: "flex", gap: "15px", overflowX: "auto" }
const relatedCard = { minWidth: "250px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflow: "hidden" }
const relatedImg = { width: "100%", height: "140px", objectFit: "cover" }

export default EventDetails