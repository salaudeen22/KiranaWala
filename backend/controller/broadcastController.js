const BroadcastService = require("../service/BroadcastService");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const Retailer = require("../model/vendorSchema");
const Order = require("../model/OrderSchema"); // Added Order model import

const Broadcast = require("../model/BroadcastSchema");

// @desc    Create a new broadcast
// @route   POST /api/broadcasts
// @access  Private (Customer)
// In controller/broadcastController.js
exports.createBroadcast = asyncHandler(async (req, res, next) => {
  const { products, coordinates, paymentMethod, deliveryAddress, orderId } = req.body;

  console.log("Received orderId:", orderId); // Debugging log to ensure orderId is received
  console.log("Received orderId in backend:", orderId); // Debugging log to ensure orderId is received

  // Validate required fields
  const missingFields = [];
  if (!products) missingFields.push("products");
  if (!coordinates) missingFields.push("coordinates");
  if (!paymentMethod) missingFields.push("paymentMethod");
  if (!deliveryAddress) missingFields.push("deliveryAddress");
  if (!orderId) missingFields.push("orderId");

  if (missingFields.length > 0) {
    console.error(`Missing required fields: ${missingFields.join(", ")}`);
    console.error("Request body:", req.body); // Log the request body for debugging
    return next(new AppError(`Missing required fields: ${missingFields.join(", ")}`, 400));
  }

  // Validate coordinates format
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    console.error("Invalid coordinates format. Expected [longitude, latitude]");
    return next(
      new AppError("Invalid coordinates format [longitude, latitude]", 400)
    );
  }

  try {
    // Debugging log to ensure all fields are passed correctly
    console.log("Creating broadcast with the following data:", {
      customerId: req.user.id,
      products,
      coordinates,
      paymentMethod,
      deliveryAddress,
      orderId,
    });

    // Create broadcast
    const broadcast = await BroadcastService.createBroadcast({
      customerId: req.user.id,
      products,
      coordinates,
      paymentMethod,
      deliveryAddress,
      orderId, // Link the broadcast to the order
    });

    console.log(`Broadcast created with ID: ${broadcast._id} for customer: ${req.user.id}`);

    // Populate product names and orderId
    const populatedBroadcast = await Broadcast.findById(broadcast._id)
      .populate({
        path: "products.productId",
        select: "name",
      })
      .populate({
        path: "orderId",
        select: "orderId status", // Include relevant fields from the order
      })
      .lean();

    // Find and notify eligible retailers
    const io = req.app.get("io");
    try {
      const retailers = await BroadcastService.findEligibleRetailers(
        coordinates,
        deliveryAddress.pincode
      );

      console.log("Eligible Retailers:", JSON.stringify(retailers, null, 2));

      // Update broadcast with potential retailers
      await Broadcast.findByIdAndUpdate(broadcast._id, {
        potentialRetailers: retailers.map((r) => r._id),
      });

      // Notify each retailer in real-time
      retailers.forEach((retailer) => {
        console.log(`Notifying retailer_${retailer._id} about broadcast_${broadcast._id}`);
        io.to(`retailer_${retailer._id}`).emit("new_order", {
          broadcastId: broadcast._id,
          customer: broadcast.customerId,
          totalAmount: broadcast.totalAmount,
          deliveryAddress: broadcast.deliveryAddress,
          createdAt: broadcast.createdAt,
          distance: retailer.distance,
        });
      });

      console.log(`Notified ${retailers.length} retailers`);
    } catch (error) {
      console.error("Retailer notification failed:", error);
    }

    res.status(201).json({
      success: true,
      data: populatedBroadcast,
    });
  } catch (error) {
    console.error("Error creating broadcast:", error);
    return next(new AppError("Failed to create broadcast", 500));
  }
});

// @desc    Accept a broadcast
// @route   PATCH /api/broadcasts/:id/accept
// @access  Private (Retailer)

exports.acceptBroadcast = asyncHandler(async (req, res, next) => {
  const broadcastId = req.params.id;
  const retailerId = req.user.retailerId;

  const broadcast = await Broadcast.findOneAndUpdate(
    {
      _id: broadcastId,
      status: "pending",
      expiryTime: { $gt: new Date() },
    },
    {
      status: "accepted",
      retailerId: retailerId,
      acceptedAt: new Date(),
    },
    { new: true }
  );

  if (!broadcast) {
    return next(new AppError("Broadcast no longer available", 400));
  }

  const retailer = await Retailer.findById(retailerId).select("name location");

  const io = req.app.get("io");
  io.to(`customer_${broadcast.customerId}`).emit("broadcast_accepted", {
    broadcastId: broadcast._id,
    retailer: {
      id: retailer._id,
      name: retailer.name,
      address: retailer.location?.address || "Address not available",
    },
  });

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
    data: broadcasts,
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
    data: broadcast,
  });
});

//x @desc    Get broadcast details
// @route   GET /api/broadcasts/:id
// @access  Private (Customer/Retailer)
exports.getBroadcastDetails = asyncHandler(async (req, res, next) => {
  const broadcast = await BroadcastService.getBroadcastDetails(req.params.id);

  res.status(200).json({
    success: true,
    data: broadcast,
  });
});
exports.getLatestBroadcastStatus = async (req, res, next) => {
  try {
    console.log("Fetching latest broadcast status...");
    // console.log("Customer ID:", req.user);
    const customerId = req.user.id || req.params.customerId; // assuming auth

    const status = await BroadcastService.getLatestStatus(customerId);

    res.status(200).json({ success: true, status });
  } catch (err) {
    next(err);
  }
};

const validStatuses = [
  "pending",
  "accepted",
  "rejected",
  "expired",
  "shipped",
  "completed",
];

exports.updateBroadcastStatus = asyncHandler(async (req, res, next) => {
  const broadcastId = req.params.id;
  const { status } = req.body;
  const retailerId = req.user.retailerId;

  console.log(`Retailer ${retailerId} is updating broadcast ${broadcastId} to status: ${status}`);

  // Validate broadcastId
  if (!mongoose.Types.ObjectId.isValid(broadcastId)) {
    console.error("Invalid Broadcast ID");
    return next(new AppError("Invalid Broadcast ID", 400));
  }

  // Validate status
  if (!status || !validStatuses.includes(status)) {
    console.error(`Invalid status: ${status}`);
    return next(new AppError(`Invalid status: ${status}`, 400));
  }

  // Update the broadcast
  const broadcast = await Broadcast.findOneAndUpdate(
    {
      _id: broadcastId,
      $or: [{ status: "pending" }, { status: "accepted" }], // Allow updates for pending or accepted broadcasts
    },
    {
      status,
      retailerId,
      acceptedAt: status === "accepted" ? new Date() : undefined,
    },
    { new: true }
  );

  if (!broadcast) {
    console.error("Broadcast no longer available or expired");
    return next(new AppError("Broadcast no longer available or expired", 400));
  }

  console.log("Broadcast updated:", broadcast);

  // Update the corresponding order status
  await Order.findByIdAndUpdate(
    broadcast.orderId,
    { status },
    { new: true }
  );

  console.log(`Order status updated for orderId: ${broadcast.orderId}`);

  // Notify customer
  const io = req.app.get("io");
  io.to(`customer_${broadcast.customerId}`).emit("broadcast_status_updated", {
    broadcastId: broadcast._id,
    newStatus: status,
    retailer: {
      id: retailerId,
      name: req.user.name,
    },
  });

  res.status(200).json({
    success: true,
    data: broadcast,
  });
});

exports.getAvailableBroadcasts = asyncHandler(async (req, res, next) => {
  // console.log(
  //   "Fetching available broadcasts for retailer:",
  //   req.user.retailerId
  // );

  const retailer = await Retailer.findById(req.user.retailerId).select(
    "serviceAreas.pincode location"
  );
  if (!retailer) {
    return next(new AppError("Retailer not found", 404));
  }

  // console.log("Retailer location:", retailer.location);

  // Extract the coordinates
  const coordinates = retailer.location.coordinates?.coordinates;

  // Validate retailer location
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return next(new AppError("Retailer location is invalid or missing", 400));
  }

  // console.log("Coordinates:", coordinates);
  console.log("Querying broadcasts...");
  const pincodes = retailer.serviceAreas.map((area) => area.pincode);
  console.log("Mapping the pincode", pincodes.length);

  const broadcasts = await Broadcast.find({
    status: { $in: ['pending', 'accepted', 'rejected', 'completed', 'cancelled', 'expired'] }, // Added 'expired'
    "deliveryAddress.pincode": { $in: pincodes },
    // location: {
    //   $nearSphere: {
    //     $geometry: {
    //       type: "Point",
    //       coordinates,
    //     },
    //     $maxDistance: 5000, // 5km
    //   },
    // },
  })
    .populate({
      path: "products.productId",
      select: "name",
    })
    .sort("-createdAt");

  console.log("Broadcasting to db", broadcasts.length);

  res.status(200).json({
    success: true,
    data: broadcasts,
  });
});
module.exports = exports;