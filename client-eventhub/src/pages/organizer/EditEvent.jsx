import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import API from "../../utils/api"

function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    category: "",
    description: "",
    maxCapacity: 50,
  })

  const [existingCover, setExistingCover] = useState("")
  const [existingExtras, setExistingExtras] = useState([])

  const [newCover, setNewCover] = useState(null)
  const [newCoverPreview, setNewCoverPreview] = useState("")
  const [newExtras, setNewExtras] = useState([])
  const [newExtraPreviews, setNewExtraPreviews] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`)

        setForm({
          title: res.data.title || "",
          date: res.data.date
            ? new Date(res.data.date).toISOString().split("T")[0]
            : "",
          location: res.data.location || "",
          category: res.data.category || "",
          description: res.data.description || "",
          maxCapacity: res.data.maxCapacity || 50,
        })

        setExistingCover(res.data.image || "")
        setExistingExtras(res.data.extraImages || [])
      } catch (err) {
        console.log(err)
        setError("Failed to load event")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNewCover = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewCover(file)
      setNewCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleNewExtras = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setNewExtras(files)
    setNewExtraPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const formData = new FormData()

      formData.append("title", form.title)
      formData.append("date", new Date(form.date))
      formData.append("location", form.location)
      formData.append("category", form.category)
      formData.append("description", form.description)
      formData.append("maxCapacity", form.maxCapacity)

      if (newCover) {
        formData.append("coverImage", newCover)
      }

      newExtras.forEach((file) => {
        formData.append("extraImages", file)
      })

      await API.put(`/events/${id}`, formData)

      alert("Event Updated Successfully!")
      navigate("/dashboard")
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Update failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p style={{ padding: "30px" }}>Loading event...</p>

  return (
    <div style={page}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: "20px" }}>Edit Event</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <input name="title" value={form.title} onChange={handleChange} placeholder="Event Title" required style={input} />

        <input type="date" name="date" value={form.date} onChange={handleChange} required style={input} />

        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required style={input} />

        <select name="category" value={form.category} onChange={handleChange} style={input}>
          <option value="">Select Category</option>
          <option>Workshops</option>
          <option>Tech Talks</option>
          <option>Cultural</option>
          <option>Sports</option>
        </select>

        <input type="number" name="maxCapacity" value={form.maxCapacity} onChange={handleChange} placeholder="Max Capacity" style={input} />

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Event Description" required style={textarea} />

        <div style={uploadBox}>
          <p style={uploadLabel}>Cover Image</p>

          {existingCover && !newCoverPreview && (
            <img src={existingCover} alt="cover" style={coverPreviewStyle} />
          )}

          {newCoverPreview && (
            <img src={newCoverPreview} alt="new cover" style={coverPreviewStyle} />
          )}

          <input type="file" accept="image/*" onChange={handleNewCover} />
        </div>

        <div style={uploadBox}>
          <p style={uploadLabel}>Extra Images (max 5)</p>

          {existingExtras.length > 0 && newExtraPreviews.length === 0 && (
            <div style={extraGrid}>
              {existingExtras.map((src, i) => (
                <img key={i} src={src} alt="" style={extraPreviewStyle} />
              ))}
            </div>
          )}

          {newExtraPreviews.length > 0 && (
            <div style={extraGrid}>
              {newExtraPreviews.map((src, i) => (
                <img key={i} src={src} alt="" style={extraPreviewStyle} />
              ))}
            </div>
          )}

          <input type="file" accept="image/*" multiple onChange={handleNewExtras} />
        </div>

        <button type="submit" style={btn} disabled={saving}>
          {saving ? "Saving..." : "Update Event"}
        </button>
      </form>
    </div>
  )
}

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  padding: "40px",
  background: "#f8fafc",
}

const formStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "500px",
  display: "flex",
  flexDirection: "column",
}

const input = { padding: "10px", marginBottom: "12px" }
const textarea = { padding: "10px", marginBottom: "12px" }

const btn = {
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
}

const errorStyle = { color: "red", marginBottom: "10px" }

const uploadBox = { marginBottom: "15px" }
const uploadLabel = { fontWeight: "bold" }

const coverPreviewStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
}

const extraGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "10px",
}

const extraPreviewStyle = {
  width: "100%",
  height: "80px",
  objectFit: "cover",
}

export default EditEvent