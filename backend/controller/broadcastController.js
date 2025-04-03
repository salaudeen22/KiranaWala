const BroadcastService = require('../service/BroadcastService');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');

// @desc    Create a new broadcast
// @route   POST /api/broadcasts
// @access  Private (Customer)
exports.createBroadcast = asyncHandler(async (req, res, next) => {
  const { products, coordinates, paymentMethod } = req.body;
  
  const broadcast = await BroadcastService.createBroadcast(
    req.user.id,
    products,
    coordinates,
    paymentMethod
  );
  
  res.status(201).json({
    success: true,
    data: broadcast
  });
});

// @desc    Accept a broadcast
// @route   PATCH /api/broadcasts/:id/accept
// @access  Private (Retailer)
exports.acceptBroadcast = asyncHandler(async (req, res, next) => {
  const broadcast = await BroadcastService.acceptBroadcast(
    req.params.id,
    req.user.retailerId
  );
  
  res.status(200).json({
    success: true,
    data: broadcast
  });
});

// @desc    Get customer's broadcasts
// @route   GET /api/broadcasts
// @access  Private (Customer)
exports.getCustomerBroadcasts = asyncHandler(async (req, res, next) => {
  const broadcasts = await BroadcastService.getCustomerBroadcasts(req.user.id);
  
  res.status(200).json({
    success: true,
    data: broadcasts
  });
});

// @desc    Cancel a broadcast
// @route   PATCH /api/broadcasts/:id/cancel
// @access  Private (Customer)
exports.cancelBroadcast = asyncHandler(async (req, res, next) => {
  const broadcast = await BroadcastService.cancelBroadcast(
    req.params.id,
    req.user.id
  );
  
  res.status(200).json({
    success: true,
    data: broadcast
  });
});

// @desc    Get broadcast details
// @route   GET /api/broadcasts/:id
// @access  Private (Customer/Retailer)
exports.getBroadcastDetails = asyncHandler(async (req, res, next) => {
  const broadcast = await BroadcastService.getBroadcastDetails(req.params.id);
  
  res.status(200).json({
    success: true,
    data: broadcast
  });
});

module.exports = exports;