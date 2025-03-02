const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RetailerSchema = new mongoose.Schema({
  retailerId: {
    type: Number,
    unique: true,
  },
  name: { type: String, required: true },
  ownerId: { type: String, ref: "Owner", required: true },
  location: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  walletBalance: { type: Number, default: 0 },
  inventory: [
    {
      productId: { type: String, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 0 },
    },
  ],
  orders: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
      status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  password: { type: String, required: true },
  registrationDetails: {
    gstNumber: { type: String, unique: true, sparse: true },
    fssaiNumber: { type: String, unique: true, sparse: true },
    businessLicense: { type: String },
  },
  phone: { type: String, required: true, unique: true },
  ratings: { averageRating: { type: Number, default: 0 }, totalReviews: { type: Number, default: 0 } },
  deliveryOptions: { selfDelivery: { type: Boolean, default: false }, partneredDelivery: { type: Boolean, default: true } },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }], 
});

RetailerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

RetailerSchema.plugin(AutoIncrement, { inc_field: "retailerId", start_seq: 1 });

module.exports = mongoose.model("Retailer", RetailerSchema);
