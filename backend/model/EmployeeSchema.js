const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-paginate-v2');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    index: true
  },
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Retailer",
    required: true
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
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8
  },
  role: {
    type: String,
    enum: ["admin", "manager", "cashier", "inventory_staff", "delivery_coordinator"],
    default: "cashier"
  },
  permissions: {
    inventory: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    customers: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    settings: { type: Boolean, default: false }
  },
  documents: {
    panCard: {
      type: String,
      required: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"]
    },
    aadhaarCard: {
      type: String,
      required: true,
      match: [/^\d{4}\s?\d{4}\s?\d{4}$/, "Invalid Aadhaar format"]
    }
  },
  profileImage: {
    type: String,
    required:true,
  },

  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  employmentDetails: {
    joiningDate: {
      type: Date,
      default: Date.now
    },
    salary: {
      type: Number,
      min: 0
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  attendance: [{
    date: Date,
    checkIn: Date,
    checkOut: Date,
    status: {
      type: String,
      enum: ["present", "absent", "half_day", "leave"],
      default: "present"
    }
  }],
  lastLogin: Date,
  deviceTokens: [String], // For push notifications
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate employee ID
EmployeeSchema.pre("save", async function(next) {
  if (!this.employeeId) {
    const prefix = this.role === "admin" ? "ADM" : 
                  this.role === "manager" ? "MGR" : "EMP";
    
    const lastEmployee = await this.constructor.findOne({ employeeId: new RegExp(`^${prefix}`) })
      .sort({ createdAt: -1 });
    
    let seq = 1;
    if (lastEmployee) {
      const lastSeq = parseInt(lastEmployee.employeeId.replace(prefix, ""));
      seq = lastSeq + 1;
    }
    
    this.employeeId = `${prefix}${seq.toString().padStart(4, "0")}`;
  }
  
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comparison method
EmployeeSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparing passwords:');
  console.log('Candidate:', candidatePassword);
  console.log('Stored hash:', this.password);
  return await bcrypt.compare(candidatePassword, this.password);
};
EmployeeSchema.plugin(mongoosePaginate);
// Virtual for formatted employee details
EmployeeSchema.virtual("formattedDetails").get(function() {
  return {
    id: this._id,
    employeeId: this.employeeId,
    name: this.name,
    role: this.role,
    email: this.email,
    phone: this.phone,
    isActive: this.employmentDetails.isActive
  };
});

module.exports = mongoose.model("Employee", EmployeeSchema);