import { Link } from "react-router-dom"
import { useState } from "react"

function EventCard({ event }) {
  const [liked, setLiked] = useState(false)

  return (
    <div style={card} className="event-card">

      <div style={imgContainer}>
        <img
          src={event.image}
          alt={event.title}
          style={img}
          className="event-img"
        />
        <button onClick={() => setLiked(!liked)} style={likeBtn}>
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      <div style={content}>
        <div>
          <h3 style={titleStyle}>{event.title}</h3>
          <p style={category}>{event.category}</p>
          <p style={date}>📅 {event.date}</p>
          <p style={desc}>
            {event.description?.length > 70
              ? event.description.slice(0, 70) + "..."
              : event.description}
          </p>
        </div>

        <Link to={`/event/${event._id}`} style={{ textDecoration: "none" }}>
          <button style={btn}>View Details</button>
        </Link>
      </div>

      <style>{`
        .event-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
        .event-card:hover .event-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}

const card = {
  width: "100%",
  background: "#fff",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  transition: "all 0.3s ease",
}

const imgContainer = { position: "relative", overflow: "hidden" }

const img = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  transition: "transform 0.3s ease",
}

const likeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "#fff",
  border: "none",
  borderRadius: "50%",
  padding: "6px 8px",
  cursor: "pointer",
  fontSize: "16px",
}

const content = {
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flexGrow: 1,
}

const titleStyle = { margin: "0 0 5px 0" }
const category = { color: "#6b7280", fontSize: "14px" }
const date = { fontSize: "13px", color: "#9ca3af" }
const desc = { fontSize: "14px", color: "#374151", margin: "10px 0", lineHeight: "1.4", flexGrow: 1 }

const btn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  width: "100%",
  fontWeight: "500",
  cursor: "pointer",
}

export default EventCard