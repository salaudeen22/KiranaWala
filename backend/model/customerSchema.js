const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CustomerSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },
    address: [
      {
        addressId: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: {
          type: String,
          required: true,
          match: [/^\d{6}$/, "Invalid Pincode"],
        },
        isDefault: { type: Boolean, default: false },
      },
    ],
    walletBalance: {
      type: Number,
      default: 0,
    },
    broadcasts: [
      {
        broadcastId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Broadcast",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "cancelled"],
          default: "pending",
        },
      },
    ],
    wishlist: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      },
    ],
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ["UPI", "Card", "Wallet"],
          required: true,
        },
        details: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    preferredStores: [
      {
        retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer" },
        lastVisited: Date,
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    deviceTokens: [
      {
        type: String,
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

CustomerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("Customer", CustomerSchema);