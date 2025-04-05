const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RetailerSchema = new mongoose.Schema(
  {
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      alias:"_id"
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    businessType: {
      type: String,
      enum: [
        "grocery",
        "pharmacy",
        "electronics",
        "general_store",
        "specialty",
        "other",
      ],
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      landmark: String,
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, "Invalid Pincode"],
      },
      coordinates: {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number], // [longitude, latitude]
      },
    },
    contact: {
      phone: {
        type: String,
        required: true,
        match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      },
      alternatePhone: String,
      email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
      supportEmail: String,
    },
    businessHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
      holidays: [
        {
          date: Date,
          name: String,
          open: Boolean,
          specialHours: { open: String, close: String },
        },
      ],
    },
    serviceAreas: [
      {
        pincode: {
          type: String,
          required: true,
        },
        deliveryFee: {
          type: Number,
          default: 0,
        },
        minOrderAmount: {
          type: Number,
          default: 0,
        },
        estimatedDeliveryTime: {
          // in minutes
          type: Number,
          default: 45,
        },
        serviceAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    settings: {
      autoAcceptOrders: {
        type: Boolean,
        default: true,
      },
      lowStockThreshold: {
        type: Number,
        default: 5,
      },
      notifyLowStock: {
        type: Boolean,
        default: true,
      },
      orderConfirmationSMS: {
        type: Boolean,
        default: true,
      },
      deliveryUpdatesSMS: {
        type: Boolean,
        default: true,
      },
      inventoryManagement: {
        type: String,
        enum: ["manual", "automatic"],
        default: "manual",
      },
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      website: String,
    },
    registrationDetails: {
      gstNumber: {
        type: String,
        match: [
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          "Invalid GST format",
        ],
      },
      fssaiNumber: {
        type: String,
        match: [/^\d{14}$/, "Invalid FSSAI format"],
      },
      businessLicense: {
        type: String,
      },
      panNumber: {
        type: String,
        match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"],
      },
      incorporationDate: Date,
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          amount: Number,
          type: {
            type: String,
            enum: ["credit", "debit"],
          },
          reference: String, // orderId, paymentId, etc.
          description: String,
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    inventory: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
        aisleLocation: String, // For physical store organization
        reorderPoint: Number,
      },
    ],
    role: {
      type: String,
      default: "admin",
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
          enum: ["pending", "accepted", "completed", "cancelled"],
          default: "pending",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    deliveryOptions: {
      selfDelivery: {
        type: Boolean,
        default: false,
      },
      partneredDelivery: {
        type: Boolean,
        default: true,
      },
      deliveryRadius: {
        // in km
        type: Number,
        default: 5,
      },
      deliveryPartners: [String], // Names or IDs of delivery partners
    },
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      breakdown: {
        productQuality: Number,
        deliverySpeed: Number,
        customerService: Number,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    verification: {
      emailVerified: {
        type: Boolean,
        default: false,
      },
      phoneVerified: {
        type: Boolean,
        default: false,
      },
      documentVerified: {
        type: Boolean,
        default: false,
      },
    },
    storeImages: [
      {
        url: String,
        caption: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    tags: [String], // eg: "24x7", "organic", "premium"
    metadata: mongoose.Schema.Types.Mixed, // For any additional custom data
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



// Text index for search
RetailerSchema.index({
  name: "text",
  displayName: "text",
  "location.address": "text",
  "location.city": "text",
  tags: "text",
});




// Password encryption middleware
RetailerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000; // Ensure token created after password change
  next();
});

// Method to check password
RetailerSchema.methods.correctPassword = async function (
  candidatePassword,
  retailerPassword
) {
  return await bcrypt.compare(candidatePassword, retailerPassword);
};

// Method to check if password changed after token was issued
RetailerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Virtual for formatted retailer ID
RetailerSchema.virtual("formattedRetailerId").get(function () {
  return `RET-${this.retailerId.toString().padStart(5, "0")}`;
});
RetailerSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Retailer", RetailerSchema);
