const Broadcast = require("../model/BroadcastSchema");
const Retailer = require("../model/vendorSchema");
const Product = require("../model/productSchema");
const Delivery = require("../model/Delivery");
const AppError = require("../utils/appError");

class BroadcastService {
  static async createBroadcast(customerId, { products, coordinates, paymentMethod }) {
    // Validate products and calculate totals
    const productDocs = await Product.find({
      _id: { $in: products.map(p => p.productId) }
    });
    
    if (productDocs.length !== products.length) {
      throw new AppError("Some products not found", 404);
    }

    let totalAmount = 0;
    const processedProducts = products.map(item => {
      const product = productDocs.find(p => p._id.equals(item.productId));
      totalAmount += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price
      };
    });

    // Create broadcast
    const broadcast = await Broadcast.create({
      customerId,
      products: processedProducts,
      location: {
        type: "Point",
        coordinates
      },
      totalAmount,
      grandTotal: totalAmount,
      paymentDetails: {
        method: paymentMethod
      }
    });

    // Find and notify nearby retailers
    const retailers = await Retailer.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates
          },
          $maxDistance: 5000 // 5km radius
        }
      },
      isActive: true
    });

    // TODO: Implement real notification system
    console.log(`Broadcast ${broadcast._id} sent to ${retailers.length} retailers`);

    return broadcast;
  }

  static async acceptBroadcast(broadcastId, retailerId) {
    const broadcast = await Broadcast.findOneAndUpdate(
      {
        _id: broadcastId,
        status: "pending",
        expiryTime: { $gt: new Date() }
      },
      {
        status: "accepted",
        retailerId
      },
      { new: true }
    );

    if (!broadcast) {
      throw new AppError("Broadcast no longer available", 400);
    }

    // Find available delivery person
    const deliveryPerson = await Delivery.findOne({
      retailerId,
      isAvailable: true
    }).sort("-rating");

    if (deliveryPerson) {
      broadcast.deliveryPersonId = deliveryPerson._id;
      deliveryPerson.assignedBroadcasts.push({ broadcastId });
      await Promise.all([broadcast.save(), deliveryPerson.save()]);
    }

    return broadcast;
  }

  static async updateBroadcastStatus(broadcastId, status) {
    return await Broadcast.findByIdAndUpdate(
      broadcastId,
      { status },
      { new: true }
    );
  }
}

module.exports = BroadcastService;