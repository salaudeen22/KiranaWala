const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: [true, 'Review must belong to an order']
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: [true, 'Review must belong to a customer']
  },
  retailer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Retailer',
    required: [true, 'Review must belong to a retailer']
  },
  deliveryRating: {
    type: Number,
    required: [true, 'Please provide a delivery rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5']
  },
  productRating: {
    type: Number,
    required: [true, 'Please provide a product rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5']
  },
  deliveryComment: {
    type: String,
    maxlength: [500, 'Comment cannot be longer than 500 characters'],
    trim: true
  },
  productComment: {
    type: String,
    maxlength: [500, 'Comment cannot be longer than 500 characters'],
    trim: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate reviews for the same order
reviewSchema.index({ order: 1 }, { unique: true });

// Populate customer and retailer when querying reviews
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'customer',
    select: 'name profilePhoto'
  }).populate({
    path: 'retailer',
    select: 'name'
  });
  
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;