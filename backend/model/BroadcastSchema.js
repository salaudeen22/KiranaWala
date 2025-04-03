const mongoose = require("mongoose");

const BroadcastSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  products: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    priceAtPurchase: {
      type: Number,
      required: true
    }
  }],
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "preparing", "ready_for_pickup", "completed", "cancelled", "failed"],
    default: "pending"
  },
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Retailer"
  },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery"
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ["COD", "UPI", "Card", "Wallet"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    }
  },
  expiryTime: {
    type: Date,
    default: () => new Date(Date.now() + 30*60*1000) // 30 minutes
  }
}, { timestamps: true });

// Geospatial index for nearby queries
BroadcastSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.Broadcast || mongoose.model('Broadcast', BroadcastSchema);