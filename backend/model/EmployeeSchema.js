const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  _id: { type: String }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ["manager", "employee"], required: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", required: true },
  panCard: { type: String, required: true },
  aadhaarCard: { type: String, required: true, unique: true },
  userImage: { type: String,required:true },
}, { timestamps: true });

EmployeeSchema.pre("save", async function (next) {
  if (!this._id) {
    const prefix = this.role === "manager" ? "M" : "EM"; 

    const lastEmployee = await mongoose
      .model("Employee")
      .findOne({ _id: new RegExp(`^${prefix}\\d+$`) }) 
      .sort({ createdAt: -1 });  // Use `createdAt` instead of `_id`

    let newNumber = 1;
    if (lastEmployee) {
      const lastNumber = parseInt(lastEmployee._id.substring(prefix.length)); 
      newNumber = lastNumber + 1; 
    }

    this._id = `${prefix}${String(newNumber).padStart(3, "0")}`; 
  }
  next();
});

module.exports = mongoose.model("Employee", EmployeeSchema);
