const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Retailer",
    required: true
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
      priceAtPurchase: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ["COD", "UPI", "Card", "Wallet"],
      required: true
    },
    transactionId: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    }
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    default: null
  },
  deliveryDetails: {
    estimatedTime: { type: Number }, 
    deliveredAt: { type: Date }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


OrderSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.quantity * item.priceAtPurchase, 0);
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
