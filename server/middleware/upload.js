const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueName + ext)
  },
})

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
})

module.exports = upload 