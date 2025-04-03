const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, "Invalid phone number"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  vehicleType: {
    type: String,
    enum: ["bike", "car", "scooter", "truck"],
    required: true
  },
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Retailer",
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  assignedBroadcasts: [{
    broadcastId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broadcast"
    },
    status: {
      type: String,
      enum: ["pending", "picked_up", "delivered", "failed"],
      default: "pending"
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  }
}, { timestamps: true });

// Geospatial index
DeliverySchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Delivery", DeliverySchema);