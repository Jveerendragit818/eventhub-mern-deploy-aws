const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// ✅ Helper: generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

// ─────────────────────────────
// POST /api/auth/register
// ─────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || "attendee",
    })

    // Return token + user info
    res.status(201).json({
      message: "Registered successfully",
      token: generateToken(user),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// ─────────────────────────────
// POST /api/auth/login
// ─────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Return token + user info
    res.json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

module.exports = router