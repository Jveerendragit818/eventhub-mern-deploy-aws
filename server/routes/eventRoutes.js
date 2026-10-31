const express = require("express")
const router = express.Router()
const path = require("path")
const Event = require("../models/Event")
const { protect, organizerOnly } = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")

// ─────────────────────────────
// GET /api/events
// Public - get all events
// ─────────────────────────────
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// ─────────────────────────────
// GET /api/events/my/schedule
// Protected - get events user joined
// IMPORTANT: this must come before /:id
// ─────────────────────────────
router.get("/my/schedule", protect, async (req, res) => {
  try {
    const events = await Event.find({ registeredUsers: req.user.id })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// ─────────────────────────────
// GET /api/events/:id
// Public - get single event
// ─────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found" })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// ─────────────────────────────
// POST /api/events
// Protected - organizer only
// accepts: coverImage (single) + extraImages (up to 5)
// ─────────────────────────────
router.post(
  "/",
  protect,
  organizerOnly,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "extraImages", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { title, date, location, category, description, maxCapacity } = req.body

      // Build cover image URL
      let coverImageUrl = "https://via.placeholder.com/400x200?text=EventHub"
      if (req.files && req.files["coverImage"]) {
        const filename = req.files["coverImage"][0].filename
        coverImageUrl = `/uploads/${filename}`
      }

      // Build extra images URLs
      let extraImageUrls = []
      if (req.files && req.files["extraImages"]) {
        extraImageUrls = req.files["extraImages"].map(
          (file) => `/uploads/${file.filename}`
        )
      }

      const event = await Event.create({
        title,
        date,
        location,
        category,
        description,
        image: coverImageUrl,
        extraImages: extraImageUrls,
        maxCapacity: maxCapacity || 50,
        createdBy: req.user.id,
      })

      res.status(201).json(event)
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message })
    }
  }
)

// ─────────────────────────────
// PUT /api/events/:id
// Protected - organizer only
// accepts: coverImage (single) + extraImages (up to 5)
// ─────────────────────────────
router.put(
  "/:id",
  protect,
  organizerOnly,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "extraImages", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
      if (!event) return res.status(404).json({ message: "Event not found" })

      const { title, date, location, category, description, maxCapacity } = req.body

      // Update cover image only if new one uploaded
      let coverImageUrl = event.image
      if (req.files && req.files["coverImage"]) {
        const filename = req.files["coverImage"][0].filename
        coverImageUrl = `/uploads/${filename}`
      }

      // Update extra images only if new ones uploaded
      let extraImageUrls = event.extraImages
      if (req.files && req.files["extraImages"]) {
        extraImageUrls = req.files["extraImages"].map(
          (file) => `/uploads/${file.filename}`
        )
      }

      const updated = await Event.findByIdAndUpdate(
        req.params.id,
        {
          title,
          date,
          location,
          category,
          description,
          maxCapacity,
          image: coverImageUrl,
          extraImages: extraImageUrls,
        },
        { new: true, runValidators: true }
      )

      res.json(updated)
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message })
    }
  }
)

// ─────────────────────────────
// DELETE /api/events/:id
// Protected - organizer only
// ─────────────────────────────
router.delete("/:id", protect, organizerOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found" })
    res.json({ message: "Event deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// ─────────────────────────────
// POST /api/events/:id/join
// Protected - attendee joins event
// ─────────────────────────────
router.post("/:id/join", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found" })

    if (event.registered >= event.maxCapacity) {
      return res.status(400).json({ message: "Event is full" })
    }

    const alreadyJoined = event.registeredUsers.includes(req.user.id)
    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined this event" })
    }

    event.registeredUsers.push(req.user.id)
    event.registered += 1
    await event.save()

    res.json({ message: "Joined successfully", event })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

module.exports = router