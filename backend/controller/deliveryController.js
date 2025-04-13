const DeliveryService = require("../service/deliveryService");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const Broadcast=require('../model/BroadcastSchema');
exports.createDeliveryPerson = asyncHandler(async (req, res) => {
  const deliveryPerson = await DeliveryService.createDeliveryPerson({
    ...req.body,
    retailerId: req.user.retailerId
  });
  res.status(201).json({
    success: true,
    data: deliveryPerson
  });
});

exports.getDeliveryPersons = asyncHandler(async (req, res) => {
  const deliveryPersons = await DeliveryService.getDeliveryPersons(req.user.retailerId);
  res.status(200).json({
    success: true,
    data: deliveryPersons
  });
});

exports.getMyDeliveries = asyncHandler(async (req, res) => {
  const deliveries = await DeliveryService.getMyDeliveries(req.user.id);
  res.status(200).json({
    success: true,
    data: deliveries
  });
});
exports.updateDeliveryStatus = asyncHandler(async (req, res) => {
  const deliveryPerson = await DeliveryService.updateDeliveryStatus(
    req.user.id,
    req.params.broadcastId,
    req.body.status
  );

  res.status(200).json({
    success: true,
    data: deliveryPerson,
  });
});

exports.getNearbyDeliveryPersons = asyncHandler(async (req, res) => {
  const { lng, lat, radius } = req.query;
  if (!lng || !lat) {
    throw new AppError("Please provide longitude and latitude", 400);
  }
  const deliveryPersons = await DeliveryService.getNearbyDeliveryPersons(
    [parseFloat(lng), parseFloat(lat)],
    parseInt(radius || 5000)
  );
  res.status(200).json({
    success: true,
    data: deliveryPersons
  });
});

exports.assignDelivery = asyncHandler(async (req, res, next) => {
  const { broadcastId, deliveryMethod, deliveryPersonId } = req.body;

  // Validate required fields
  if (!broadcastId || !deliveryMethod) {
    return next(new AppError("Broadcast ID and Delivery Method are required", 400));
  }

  if (deliveryMethod === "partner" && !deliveryPersonId) {
    return next(new AppError("Delivery Person ID is required for partner delivery", 400));
  }

  // Update the broadcast with the assigned delivery method and person
  const updateData = {
    deliveryMethod,
    status: "assigned",
  };

  if (deliveryMethod === "partner") {
    updateData.deliveryPersonId = deliveryPersonId;
  }

  const broadcast = await Broadcast.findByIdAndUpdate(broadcastId, updateData, { new: true });

  if (!broadcast) {
    return next(new AppError("Broadcast not found", 404));
  }

  // Notify the delivery person if it's a partner delivery
  if (deliveryMethod === "partner") {
    const io = req.app.get("io");
    io.to(`delivery_${deliveryPersonId}`).emit("new_delivery", broadcast);
  }

  res.status(200).json({
    success: true,
    data: broadcast,
  });
});