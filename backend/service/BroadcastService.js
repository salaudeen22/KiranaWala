const Broadcast = require("../model/BroadcastSchema");
const Retailer = require("../model/vendorSchema");
const Product = require("../model/productSchema");
const Delivery = require("../model/Delivery");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

class BroadcastService {
  static async validateProducts(products) {
    if (!products || !Array.isArray(products)) {
      throw new AppError("Invalid products format", 400);
    }
    const productIds = products.map((p) => p.productId);
    const availableProducts = await Product.find({ _id: { $in: productIds } });

    const validProducts = [];
    const invalidProducts = [];

    products.forEach((product) => {
      const foundProduct = availableProducts.find((p) =>
        p._id.equals(product.productId)
      );
      if (foundProduct) {
        validProducts.push({
          ...product,
          priceAtPurchase: foundProduct.price,
        });
      } else {
        invalidProducts.push(product.productId);
      }
    });

    return { validProducts, invalidProducts };
  }

  static async createBroadcast({
    customerId,
    products,
    coordinates,
    paymentMethod,
    deliveryAddress,
  }) {
    if (
      !customerId ||
      !products ||
      !coordinates ||
      !paymentMethod ||
      !deliveryAddress
    ) {
      throw new AppError("Missing required fields", 400);
    }

    // Validate products
    console.log("Validating products...");
    const { validProducts, invalidProducts } =
      await BroadcastService.validateProducts(products);
    console.log("Valid Products:", validProducts);
    console.log("Invalid Products:", invalidProducts);

    if (invalidProducts.length > 0) {
      throw new AppError(
        `Products not available: ${invalidProducts.join(", ")}`,
        400
      );
    }

    // Calculate totalAmount and grandTotal
    const totalAmount = validProducts.reduce((sum, product) => {
      return sum + product.priceAtPurchase * product.quantity;
    }, 0);

    const taxRate = 0.05; // 5% tax
    const deliveryFee = 20; // Fixed delivery fee
    const grandTotal = totalAmount * (1 + taxRate) + deliveryFee;

    // Create broadcast
    const broadcast = await Broadcast.create({
      customerId,
      products: validProducts,
      location: { type: "Point", coordinates },
      paymentDetails: { method: paymentMethod, status: "pending" },
      deliveryAddress,
      totalAmount,
      grandTotal,
      status: "pending",
      expiryTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
    });

    return broadcast.populate("customerId", "name phone");
  }

  static async getCustomerBroadcasts(customerId) {
    return await Broadcast.find({ customerId })
      .sort("-createdAt")
      .populate("retailerId", "name");
  }
  static async cancelBroadcast(broadcastId, customerId) {
    return await Broadcast.findOneAndUpdate(
      { _id: broadcastId, customerId, status: "pending" },
      { status: "cancelled" },
      { new: true }
    );
  }

  static async findEligibleRetailers(coordinates, pincode) {
    console.log("Finding eligible retailers...");
    console.log("Coordinates:", coordinates);
    console.log("Pincode:", pincode);

    try {
      const retailers = await Retailer.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: coordinates
            },
            $maxDistance: 5000 // Adjust the distance as needed (in meters)
          }
        },
        serviceablePincodes: pincode // Ensure this field exists in the Retailer schema
      });

      console.log("Eligible Retailers:", retailers);
      return retailers;
    } catch (error) {
      console.error("Error finding eligible retailers:", error);
      return [];
    }
  }

  static async getBroadcastDetails(broadcastId) {
    if (!mongoose.Types.ObjectId.isValid(broadcastId)) {
      throw new AppError("Invalid Broadcast ID", 400);
    }

    const broadcast = await Broadcast.findById(broadcastId).populate(
      "customerId retailerId products.productId",
      "name email location price"
    );

    if (!broadcast) {
      throw new AppError("Broadcast not found", 404);
    }

    return broadcast;
  }

  // In service/BroadcastService.js
  static notifyRetailers(retailers, broadcast) {
    const io = require("../app").io; // Get the io instance from app

    retailers.forEach((retailer) => {
      io.to(`retailer_${retailer._id}`).emit("new_broadcast", {
        broadcastId: broadcast._id,
        products: broadcast.products,
        deliveryAddress: broadcast.deliveryAddress,
        expiryTime: broadcast.expiryTime,
      });
    });
  }
}

module.exports = BroadcastService;
