const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
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
  address: [
    {
      addressId: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true, match: [/^\d{6}$/, "Invalid Pincode"] },
      isDefault: { type: Boolean, default: false }
    }
  ],
  walletBalance: {
    type: Number,
    default: 0
  },
  orders: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
      status: { type: String, enum: ["pending", "delivered", "cancelled"], default: "pending" }
    }
  ],
  wishlist: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    }
  ],
  paymentMethods: [
    {
      type: {
        type: String,
        enum: ["UPI", "Card", "Wallet"],
        required: true
      },
      details: { type: String, required: true },
      isDefault: { type: Boolean, default: false }
    }
  ]


}  , { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
