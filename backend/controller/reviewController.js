const Review = require('../model/reviewSchema');
const Order = require('../model/OrderSchema');
const AppError = require('../utils/appError');
const asyncHandler = require('express-async-handler');
const Customer = require('../model/customerSchema');
const Retailer = require('../model/vendorSchema');

// @desc    Create review for delivered order
// @route   POST /api/reviews
// @access  Private (Customer)
exports.createReview = asyncHandler(async (req, res, next) => {
  const { orderId, deliveryRating, productRating, deliveryComment, productComment } = req.body;
  
  // 1) Check if order exists and belongs to customer
  const order = await Order.findOne({
    _id: orderId,
    customerId: req.user.id,
    status: 'delivered'
  });
  
  if (!order) {
    return next(new AppError('Order not found or not eligible for review', 404));
  }
  
  // 2) Check if review already exists
  const existingReview = await Review.findOne({ order: orderId });
  if (existingReview) {
    return next(new AppError('You have already reviewed this order', 400));
  }
  
  // 3) Create review
  const review = await Review.create({
    order: orderId,
    customer: req.user.id,
    retailer: order.retailerId,
    deliveryRating,
    productRating,
    deliveryComment,
    productComment,
    images: req.files?.map(file => ({ url: file.path, publicId: file.filename })) || []
  });
  
  // 4) Update order review status
  order.reviewStatus = 'completed';
  order.reviewedAt = new Date();
  await order.save();
  
  // 5) Update retailer ratings (average calculation)
  await this.updateRetailerRatings(order.retailerId);
  
  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Helper to update retailer's average ratings
exports.updateRetailerRatings = async (retailerId) => {
  const stats = await Review.aggregate([
    {
      $match: { retailer: retailerId }
    },
    {
      $group: {
        _id: '$retailer',
        nDeliveryRatings: { $sum: 1 },
        avgDeliveryRating: { $avg: '$deliveryRating' },
        avgProductRating: { $avg: '$productRating' }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await Retailer.findByIdAndUpdate(retailerId, {
      averageDeliveryRating: stats[0].avgDeliveryRating,
      averageProductRating: stats[0].avgProductRating,
      totalReviews: stats[0].nDeliveryRatings
    });
  }
};

// @desc    Get all reviews for a retailer
// @route   GET /api/reviews/retailer/:retailerId
// @access  Public
exports.getRetailerReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ retailer: req.params.retailerId })
    .sort('-createdAt')
    .populate('customer', 'name profilePhoto');
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .sort('-createdAt')
    .populate('customer', 'name profilePhoto');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// @desc    Get customer's reviews
// @route   GET /api/reviews/me
// @access  Private (Customer)
exports.getMyReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ customer: req.user.id })
    .populate('retailer', 'name')
    .populate('order', 'orderNumber');
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});