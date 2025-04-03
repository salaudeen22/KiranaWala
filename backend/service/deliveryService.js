const Delivery = require("../model/Delivery");
const Broadcast = require("../model/BroadcastSchema");
const AppError = require("../utils/appError");

class DeliveryService {
  static async createDeliveryPerson(deliveryData) {
    const existing = await Delivery.findOne({
      $or: [{ phone: deliveryData.phone }, { email: deliveryData.email }]
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
    return await Delivery.findById(deliveryPersonId)
      .populate("assignedBroadcasts.broadcastId");
  }

  static async updateDeliveryStatus(deliveryPersonId, broadcastId, status) {
    const deliveryPerson = await Delivery.findById(deliveryPersonId);
    if (!deliveryPerson) {
      throw new AppError("Delivery person not found", 404);
    }

    const broadcastIndex = deliveryPerson.assignedBroadcasts.findIndex(
      b => b.broadcastId.toString() === broadcastId
    );
    if (broadcastIndex === -1) {
      throw new AppError("Broadcast not assigned to this delivery person", 404);
    }

    deliveryPerson.assignedBroadcasts[broadcastIndex].status = status;
    await deliveryPerson.save();

    // Update broadcast status
    let broadcastStatus;
    switch (status) {
      case "picked_up":
        broadcastStatus = "preparing";
        break;
      case "delivered":
        broadcastStatus = "completed";
        break;
      case "failed":
        broadcastStatus = "failed";
        break;
      default:
        broadcastStatus = "accepted";
    }

    await BroadcastService.updateBroadcastStatus(broadcastId, broadcastStatus);

    return deliveryPerson;
  }

  static async getNearbyDeliveryPersons(coordinates, radius = 5000) {
    return await Delivery.find({
      isAvailable: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates
          },
          $maxDistance: radius
        }
      }
    });
  }
}

module.exports = DeliveryService;