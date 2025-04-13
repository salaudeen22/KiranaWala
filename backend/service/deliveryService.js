const Delivery = require("../model/Delivery");
const Broadcast = require("../model/BroadcastSchema");
const AppError = require("../utils/appError");

class DeliveryService {
  static async createDeliveryPerson(deliveryData) {
    const existing = await Delivery.findOne({
      $or: [{ phone: deliveryData.phone }, { email: deliveryData.email }],
    });
    if (existing) {
      throw new AppError("Delivery person already exists", 400);
    }

    return await Delivery.create(deliveryData);
  }

  static async getDeliveryPersons(retailerId) {
    return await Delivery.find({ retailerId });
  }

  static async getMyDeliveries(deliveryPersonId) {
    return await Delivery.findById(deliveryPersonId).populate(
      "assignedBroadcasts.broadcastId"
    );
  }
// In service/DeliveryService.js
static async updateDeliveryStatus(deliveryPersonId, broadcastId, status) {
  const deliveryPerson = await Delivery.findOneAndUpdate(
    {
      _id: deliveryPersonId,
      'assignedBroadcasts.broadcastId': broadcastId
    },
    {
      $set: { 'assignedBroadcasts.$.status': status }
    },
    { new: true }
  );

  if (!deliveryPerson) {
    throw new AppError('Delivery assignment not found', 404);
  }

  const broadcast = await Broadcast.findByIdAndUpdate(
    broadcastId,
    { status },
    { new: true }
  );

  return broadcast;
}
  static async getNearbyDeliveryPersons(coordinates, radius = 5000) {
    return await Delivery.find({
      isAvailable: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates,
          },
          $maxDistance: radius,
        },
      },
    });
  }
}

module.exports = DeliveryService;
