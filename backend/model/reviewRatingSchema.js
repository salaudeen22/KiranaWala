const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  type: {
    type: String,
    enum: ["Product", "Retailer", "Delivery"],
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: function () {
      return this.type === "Product";
    }
  },
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Retailer",
    required: function () {
      return this.type === "Retailer";
    }
  },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    required: function () {
      return this.type === "Delivery";
    }
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
