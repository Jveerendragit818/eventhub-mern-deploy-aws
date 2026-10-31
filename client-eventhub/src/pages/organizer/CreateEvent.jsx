import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import API from "../../utils/api"

function CreateEvent() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [maxCapacity, setMaxCapacity] = useState(50)

  // ✅ Image states
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState("")
  const [extraImages, setExtraImages] = useState([])
  const [extraPreviews, setExtraPreviews] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (user?.role !== "organizer") {
    return <h2 style={{ padding: "20px" }}>Access Denied</h2>
  }

  // Handle cover image selection
  const handleCoverImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  // Handle extra images selection (up to 5)
  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setExtraImages(files)
    setExtraPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  // Remove a specific extra image preview
  const removeExtraImage = (index) => {
    const updatedFiles = extraImages.filter((_, i) => i !== index)
    const updatedPreviews = extraPreviews.filter((_, i) => i !== index)
    setExtraImages(updatedFiles)
    setExtraPreviews(updatedPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // ✅ Use FormData because we're sending files
      const formData = new FormData()
      formData.append("title", title)
      formData.append("date", date)
      formData.append("location", location)
      formData.append("category", category)
      formData.append("description", description)
      formData.append("maxCapacity", maxCapacity)

      if (coverImage) {
        formData.append("coverImage", coverImage)
      }

      extraImages.forEach((file) => {
        formData.append("extraImages", file)
      })

      await API.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      alert("Event Created Successfully!")
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={page}>
      <form onSubmit={handleSubmit} style={form}>
        <h2 style={{ marginBottom: "20px" }}>Create Event</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={input}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={input}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={input}
        >
          <option value="">Select Category</option>
          <option>Workshops</option>
          <option>Tech Talks</option>
          <option>Cultural</option>
          <option>Sports</option>
        </select>

        <input
          type="number"
          placeholder="Max Capacity"
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={textarea}
        />

        {/* ✅ COVER IMAGE */}
        <div style={uploadBox}>
          <p style={uploadLabel}>Cover Image <span style={badge}>Required</span></p>
          <p style={uploadHint}>This will be the main banner shown on event cards and details page.</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImage}
            style={{ marginBottom: "10px" }}
          />

          {coverPreview && (
            <div style={{ position: "relative" }}>
              <img src={coverPreview} alt="cover preview" style={coverPreviewStyle} />
              <button
                type="button"
                onClick={() => { setCoverImage(null); setCoverPreview("") }}
                style={removeBtn}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* ✅ EXTRA IMAGES */}
        <div style={uploadBox}>
          <p style={uploadLabel}>Extra Images <span style={optionalBadge}>Optional — max 5</span></p>
          <p style={uploadHint}>These will appear in the image gallery on the event details page.</p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleExtraImages}
            style={{ marginBottom: "10px" }}
          />

          {extraPreviews.length > 0 && (
            <div style={extraGrid}>
              {extraPreviews.map((src, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img src={src} alt={`extra-${index}`} style={extraPreviewStyle} />
                  <button
                    type="button"
                    onClick={() => removeExtraImage(index)}
                    style={removeSmallBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" style={btn} disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  )
}

const page = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", background: "#f8fafc", padding: "40px 20px" }
const form = { background: "#fff", padding: "30px", borderRadius: "14px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column" }
const input = { padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }
const textarea = { padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", minHeight: "100px", fontSize: "14px" }
const btn = { background: "#2563eb", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginTop: "10px" }
const errorStyle = { background: "#fef2f2", color: "#dc2626", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }

const uploadBox = { background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "10px", padding: "16px", marginBottom: "20px" }
const uploadLabel = { fontWeight: "600", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }
const uploadHint = { fontSize: "12px", color: "#6b7280", marginBottom: "10px" }
const badge = { background: "#dbeafe", color: "#1d4ed8", fontSize: "11px", padding: "2px 8px", borderRadius: "10px" }
const optionalBadge = { background: "#f3f4f6", color: "#6b7280", fontSize: "11px", padding: "2px 8px", borderRadius: "10px" }

const coverPreviewStyle = { width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }
const removeBtn = { marginTop: "8px", background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }

const extraGrid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "10px" }
const extraPreviewStyle = { width: "100%", height: "90px", objectFit: "cover", borderRadius: "8px" }
const removeSmallBtn = { position: "absolute", top: "4px", right: "4px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }

export default CreateEvent