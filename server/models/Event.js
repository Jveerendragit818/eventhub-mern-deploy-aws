const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Workshops", "Tech Talks", "Cultural", "Sports"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // ✅ Cover image URL
    image: {
      type: String,
      default: "https://via.placeholder.com/400x200?text=EventHub",
    },
    // ✅ Extra images array of URLs
    extraImages: {
      type: [String],
      default: [],
    },
    maxCapacity: {
      type: Number,
      default: 50,
    },
    registered: {
      type: Number,
      default: 0,
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Event", eventSchema)