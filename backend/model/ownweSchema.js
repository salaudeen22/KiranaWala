const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, "Invalid phone number"]
  },
  pan: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"]
  },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{4}-\d{4}-\d{4}$/, "Invalid Aadhaar format"]
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true, match: [/^\d{6}$/, "Invalid Pincode"] }
  },
  storesOwned: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Retailer" }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Owner", OwnerSchema);
