const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Grocery",
      "Dairy",
      "Snacks",
      "Beverages",
      "Personal Care",
      "Household",
      "Other",
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  finalPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  retailerId: {
    type: Number,
    ref: "Retailer",
    required: true,
  },
  expiryDate: {
    type: Date,
    required: function () {
      return this.category === "Dairy" || this.category === "Grocery";
    },
  },
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String },
    },
  ],
  ratings: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
