const DeliveryService = require("../service/deliveryService");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

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
    data: deliveryPerson
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