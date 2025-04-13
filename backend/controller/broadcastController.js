const BroadcastService = require('../service/BroadcastService');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const Retailer = require('../model/vendorSchema');

const Broadcast = require('../model/BroadcastSchema');

// @desc    Create a new broadcast
// @route   POST /api/broadcasts
// @access  Private (Customer)
// In controller/broadcastController.js
exports.createBroadcast = asyncHandler(async (req, res, next) => {
  const { products, coordinates, paymentMethod, deliveryAddress } = req.body;
  
  const broadcast = await BroadcastService.createBroadcast({
    customerId: req.user.id,
    products,
    coordinates,
    paymentMethod,
    deliveryAddress
  });
  
  res.status(201).json({
    success: true,
    data: broadcast
  });
});

// @desc    Accept a broadcast
// @route   PATCH /api/broadcasts/:id/accept
// @access  Private (Retailer)

exports.acceptBroadcast = asyncHandler(async (req, res, next) => {
  const broadcastId = req.params.id;

  // Validate broadcastId
  if (!mongoose.Types.ObjectId.isValid(broadcastId)) {
    return next(new AppError("Invalid Broadcast ID", 400));
  }

  const broadcast = await Broadcast.findOneAndUpdate(
    {
      _id: broadcastId,
      status: "pending",
      expiryTime: { $gt: new Date() },
    },
    {
      status: "accepted",
      retailerId: req.user.retailerId,
      acceptedAt: new Date(),
    },
    { new: true }
  );

  if (!broadcast) {
    return next(new AppError("Broadcast no longer available", 400));
  }

  // Notify the customer
  const io = req.app.get("io");
  io.to(`customer_${broadcast.customerId}`).emit("broadcast_accepted", broadcast);

  res.status(200).json({
    success: true,
    data: broadcast,
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

exports.updateBroadcastStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate required fields
  if (!status) {
    return next(new AppError("Status is required", 400));
  }

  // Update the list of valid statuses
  const validStatuses = ["pending","ready","in_transit", "accepted", "preparing", "rejected", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return next(new AppError(`Invalid status: ${status}`, 400));
  }

  // Update the broadcast status
  const broadcast = await Broadcast.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!broadcast) {
    return next(new AppError("Broadcast not found", 404));
  }

  res.status(200).json({
    success: true,
    data: broadcast,
  });
});
exports.getAvailableBroadcasts = asyncHandler(async (req, res, next) => {
  console.log('Fetching available broadcasts for retailer:', req.user.retailerId);

  const retailer = await Retailer.findById(req.user.retailerId).select('serviceAreas.pincode location');
  if (!retailer) {
    return next(new AppError('Retailer not found', 404));
  }

  console.log('Retailer location:', retailer.location);

  // Extract the coordinates
  const coordinates = retailer.location.coordinates?.coordinates;

  // Validate retailer location
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return next(new AppError('Retailer location is invalid or missing', 400));
  }

console.log('Coordinates:', coordinates);
console.log('Querying broadcasts...');
  const pincodes = retailer.serviceAreas.map((area) => area.pincode);
  console.log('Pincodes:', pincodes);

  const broadcasts = await Broadcast.find({
    status: { $in: ["pending", "accepted", "preparing", "in_transit"] },
    'deliveryAddress.pincode': { $in: pincodes },
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates, 
        },
        $maxDistance: 5000, // 5km
      },
    },
  }).sort('-createdAt');

  console.log('Broadcasts:', broadcasts);

  res.status(200).json({
    success: true,
    data: broadcasts,
  });
});
module.exports = exports;