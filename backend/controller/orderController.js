const Order = require('../model/OrderSchema');
const Broadcast = require('../model/BroadcastSchema');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');

// Update order status when broadcast status changes
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { broadcastId, status } = req.body;

  // Validate broadcast ID and status
  if (!broadcastId || !status) {
    return next(new AppError("Broadcast ID and status are required", 400));
  }

  // Find the broadcast and update its status
  const broadcast = await Broadcast.findByIdAndUpdate(
    broadcastId,
    { status },
    { new: true }
  );

  if (!broadcast) {
    return next(new AppError("Broadcast not found", 404));
  }

  console.log("Broadcast updated:", broadcast);

  // Update the corresponding order status
  const order = await Order.findByIdAndUpdate(
    broadcast.orderId, // Ensure this matches the `orderId` field in the Broadcast schema
    { status },
    { new: true }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  console.log("Order updated:", order);

  res.status(200).json({
    success: true,
    data: { broadcast, order },
  });
});
