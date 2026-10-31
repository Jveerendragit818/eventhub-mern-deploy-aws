const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()

// ✅ Middleware
app.use(cors())
app.use(express.json())

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/events", require("./routes/eventRoutes"))

// ✅ Health check
app.get("/", (req, res) => {
  res.send("EventHub API running ✅")
})

// ✅ Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected")
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message)
  })