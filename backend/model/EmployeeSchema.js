const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ["manager", "employee"], required: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", required: true }, // Changed from Vendor to Retailer
  panCard: { type: String, required: true }, 
  aadhaarCard: { type: String, required: true, unique: true },
  userImage: { type: String }, 
});

module.exports = mongoose.model("Employee", EmployeeSchema);
