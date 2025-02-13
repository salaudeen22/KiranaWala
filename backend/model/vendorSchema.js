const mongoose = require("mongoose");

const RetailerSchema = new mongoose.Schema({
  retailerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true
  },
  location: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  inventory: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 0 }
    }
  ],
  orders: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
      status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" }
    }
  ],
  registrationDetails: {
    gstNumber: { type: String, unique: true, sparse: true },
    fssaiNumber: { type: String, unique: true, sparse: true },
    businessLicense: { type: String }
  },
  contactDetails: {
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    whatsapp: { type: String }
  },
  ratings: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
 
  deliveryOptions: {
    selfDelivery: { type: Boolean, default: false },
    partneredDelivery: { type: Boolean, default: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Retailer", RetailerSchema);
