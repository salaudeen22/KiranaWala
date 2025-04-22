const mongoose = require('mongoose');
const Retailer = require('./vendorSchema');

const BroadcastSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
    
    },
  },
  status: {
    type: String,
    enum: [
      'pending',       // Waiting for retailer response
      'accepted',      // Retailer accepted broadcast
      'rejected',      // No retailers accepted
      'expired',       // Broadcast timed out
      'shipped',       // Order is shipped
      'completed'      // Order fulfillment completed
    ],
    default: 'pending'
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['UPI', 'Card', 'Wallet', 'Cash on Delivery'],
      required: true,
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  grandTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid pincode!`,
      },
    },
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiryTime: {
    type: Date,
    default: () => new Date(Date.now() + 30*60000) // 30 minutes expiry
  },
  acceptedAt: Date,
  deliveredAt: Date,
  potentialRetailers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer'
  }]
});


BroadcastSchema.index({ location: '2dsphere' });

// Prevent OverwriteModelError
module.exports = mongoose.models.Broadcast || mongoose.model('Broadcast', BroadcastSchema);