const BroadcastService = require("../service/BroadcastService");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const Retailer = require("../model/vendorSchema");

const Broadcast = require("../model/BroadcastSchema");

// @desc    Create a new broadcast
// @route   POST /api/broadcasts
// @access  Private (Customer)
// In controller/broadcastController.js
exports.createBroadcast = asyncHandler(async (req, res, next) => {
  const { products, coordinates, paymentMethod, deliveryAddress } = req.body;

  // Validate required fields
  if (!products || !coordinates || !paymentMethod || !deliveryAddress) {
    return next(new AppError("Missing required fields", 400));
  }

  // Validate coordinates format
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return next(
      new AppError("Invalid coordinates format [longitude, latitude]", 400)
    );
  }

  try {
    // Create broadcast
    const broadcast = await BroadcastService.createBroadcast({
      customerId: req.user.id,
      products,
      coordinates,
      paymentMethod,
      deliveryAddress,
    });

    console.log(`Broadcast created with ID: ${broadcast._id} for customer: ${req.user.id}`);

    // Populate product names
    const populatedBroadcast = await Broadcast.findById(broadcast._id)
      .populate({
        path: "products.productId",
        select: "name",
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
        req.io.to(`retailer_${retailer._id}`).emit("new_order", {
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

  console.log(`Retailer ${retailerId} is accepting broadcast ${broadcastId}`);

  // Validate broadcastId
  if (!mongoose.Types.ObjectId.isValid(broadcastId)) {
    console.error("Invalid Broadcast ID");
    return next(new AppError("Invalid Broadcast ID", 400));
  }

  // Find and update the broadcast
  const broadcast = await Broadcast.findOneAndUpdate(
    {
      _id: broadcastId,
      status: "pending",
      expiryTime: { $gt: new Date() }
    },
    {
      status: "accepted",
      retailerId: retailerId,
      acceptedAt: new Date()
    },
    { new: true }
  );

  if (!broadcast) {
    console.error("Broadcast no longer available or expired");
    return next(new AppError("Broadcast no longer available", 400));
  }

  console.log("Broadcast accepted:", broadcast);

  // Fetch retailer details
  const retailer = await Retailer.findById(retailerId).select("name location");
  if (!retailer) {
    console.error("Retailer not found");
    return next(new AppError("Retailer not found", 404));
  }

  console.log("Retailer details:", retailer);

  try {
    // Get the io instance from the app
    const io = req.app.get('io');
    
    // Emit notification to the customer's room
    io.to(`customer_${broadcast.customerId}`).emit("broadcast_accepted", {
      broadcastId: broadcast._id,
      retailer: {
        id: retailer._id,
        name: retailer.name,
        address: retailer.location?.address || "Address not available"
      },
      orderDetails: {
        totalAmount: broadcast.totalAmount,
        items: broadcast.products.map(p => ({
          name: p.productId.name,
          quantity: p.quantity,
          price: p.priceAtPurchase
        }))
      }
    });

    console.log(`Notified customer_${broadcast.customerId} about accepted broadcast_${broadcast._id}`);

    res.status(200).json({
      success: true,
      data: broadcast
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return next(new AppError("Failed to send notification", 500));
  }
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
      expiryTime: { $gt: new Date() },
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
    return next(new AppError("Broadcast no longer available", 400));
  }

  console.log("Broadcast updated:", broadcast);

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
    status: { $in: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'] },
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