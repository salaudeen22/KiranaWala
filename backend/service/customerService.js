const Customer = require("../model/customerSchema");
const AppError = require("../utils/appError");
const { signToken } = require("../utils/auth");

const Broadcast = require("../model/BroadcastSchema");
const Retailer = require("../model/vendorSchema");
const Order=require("../model/OrderSchema");
const Product = require("../model/productSchema");
const mongoose = require("mongoose");

class CustomerService {
  // Register new customer
  static async register({ name, email, phone, password }) {
    // Check if customer exists
    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingCustomer) {
      throw new AppError(
        "Customer with this email or phone already exists",
        400
      );
    }

    // Create customer
    const customer = await Customer.create({ name, email, phone, password });

    // Generate token
    const token = signToken(customer._id);

    return { customer, token };
  }

  // Login customer
  static async login(email, password) {
    const customer = await Customer.findOne({ email }).select("+password");

    if (
      !customer ||
      !(await customer.comparePassword(password, customer.password))
    ) {
      throw new AppError("Incorrect email or password", 401);
    }

    const token = signToken(customer._id);
    return { customer, token };
  }

  // Get customer profile
  static async getProfile(userId) {
    return await Customer.findById(userId);
  }

  // Update profile
  static async updateProfile(userId, updateData) {
    return await Customer.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // Add address
  static async addAddress(userId, addressData) {
    const customer = await Customer.findById(userId);

    // Check for duplicate address
    const exists = customer.address.some(
      (addr) =>
        addr.pincode === addressData.pincode &&
        addr.street === addressData.street
    );

    if (exists) throw new AppError("Address already exists", 400);

    customer.address.push(addressData);
    await customer.save();
    return customer.address;
  }

  // @desc    Get customer orders
  // @route   GET /api/customers/orders
  // @access  Private
  static async getOrders(userId) {
    return await Order.find({ customerId: userId })
      .sort("-createdAt")
      .populate("items.productId", "name price images");
  }

  // @desc    Get order details
  // @route   GET /api/customers/orders/:id
  // @access  Private
  static async getOrderDetails(userId, orderId) {
    const order = await Order.findOne({
      _id: orderId,
      customerId: userId,
    })
      .populate("items.productId", "name price images")
      .populate("retailerId", "name phone");

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }

  // @desc    Place an order
  // @route   POST /api/customers/orders
  // @access  Private
  static async placeOrder(userId, orderData) {
    const { items, deliveryAddress, paymentMethod, retailerId } = orderData;

    // Validate items
    if (!items || items.length === 0) {
      throw new AppError("At least one item is required", 400);
    }

    // Get product details and calculate totals
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Prepare order items with current prices
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.equals(item.productId));
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }
      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for product ${product.name}`,
          400
        );
      }

      return {
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        discount: product.discount,
        finalPrice: product.finalPrice,
        image: product.images[0]?.url || null,
      };
    });

    // Calculate totals
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0
    );
    const tax = subtotal * 0.05; // 5% tax
    const deliveryFee = 20; // Fixed delivery fee
    const total = subtotal + tax + deliveryFee;

    // Create order
    const order = await Order.create({
      customerId: userId,
      retailerId,
      items: orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: "pending",
    });

    // Update product stocks
    await Promise.all(
      items.map((item) =>
        Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    return order;
  }

  // @desc    Cancel an order
  // @route   PATCH /api/customers/orders/:id/cancel
  // @access  Private
  static async cancelOrder(userId, orderId) {
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        customerId: userId,
        status: { $in: ["pending", "confirmed"] },
      },
      { status: "cancelled" },
      { new: true }
    );

    if (!order) {
      throw new AppError("Order not found or cannot be cancelled", 400);
    }

    // Restore product stocks
    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        })
      )
    );

    return order;
  }

  // Update password
  static async updatePassword(userId, currentPassword, newPassword) {
    const customer = await Customer.findById(userId).select("+password");

    if (!(await customer.comparePassword(currentPassword, customer.password))) {
      throw new AppError("Current password is incorrect", 401);
    }

    customer.password = newPassword;
    await customer.save();
    return customer;
  }
  // ... (existing methods remain the same)

  // @desc    Delete customer account
  // @route   DELETE /api/customers/profile
  // @access  Private
  static async deleteAccount(userId) {
    const customer = await Customer.findByIdAndDelete(userId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customer;
  }

  // @desc    Update address
  // @route   PUT /api/customers/address/:addressId
  // @access  Private
  static async updateAddress(userId, addressId, updateData) {
    const customer = await Customer.findById(userId);

    const addressIndex = customer.address.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      throw new AppError("Address not found", 404);
    }

    Object.assign(customer.address[addressIndex], updateData);
    await customer.save();
    return customer.address;
  }

  // @desc    Get wallet balance
  // @route   GET /api/customers/wallet
  // @access  Private
  static async getWallet(userId) {
    const customer = await Customer.findById(userId).select("walletBalance");
    return customer.walletBalance;
  }

  // @desc    Top up wallet
  // @route   POST /api/customers/wallet/topup
  // @access  Private
  static async topUpWallet(userId, amount) {
    if (amount <= 0) {
      throw new AppError("Amount must be positive", 400);
    }

    const customer = await Customer.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: amount } },
      { new: true }
    ).select("walletBalance");

    return customer;
  }

  // @desc    Get wishlist
  // @route   GET /api/customers/wishlist
  // @access  Private
  static async getWishlist(userId) {
    const customer = await Customer.findById(userId)
      .select("wishlist")
      .populate("wishlist.productId", "name price images"); // Include images in the response

    return customer.wishlist.map(item => ({
      ...item.toObject(),
      productId: {
        ...item.productId.toObject(),
        image: item.productId.images?.[0]?.url || null // Add the first image URL
      }
    }));
  }

  // @desc    Add to wishlist
  // @route   POST /api/customers/wishlist/:productId
  // @access  Private
  static async addToWishlist(userId, productId) {
    const customer = await Customer.findById(userId);

    // Check if already in wishlist
    if (
      customer.wishlist.some((item) => item.productId.toString() === productId)
    ) {
      throw new AppError("Product already in wishlist", 400);
    }

    customer.wishlist.push({ productId });
    await customer.save();
    return customer.wishlist;
  }

  // @desc    Remove from wishlist
  // @route   DELETE /api/customers/wishlist/:productId
  // @access  Private
  static async removeFromWishlist(userId, productId) {
    const customer = await Customer.findById(userId);

    const initialLength = customer.wishlist.length;
    customer.wishlist = customer.wishlist.filter(
      (item) => item.productId.toString() !== productId
    );

    if (customer.wishlist.length === initialLength) {
      throw new AppError("Product not found in wishlist", 404);
    }

    await customer.save();
    return customer.wishlist;
  }

  // @desc    Create product broadcast
  // @route   POST /api/customers/broadcasts
  // @access  Private

  static async createBroadcast({
    customerId,
    products,
    coordinates,
    paymentDetails,
    deliveryAddress,
    totalAmount,
    grandTotal,
  }) {
    // Validate products
    if (!products || products.length === 0) {
      throw new AppError("At least one product is required", 400);
    }

    // Verify all products have priceAtPurchase
    const invalidProducts = products.filter((p) => !p.priceAtPurchase);
    if (invalidProducts.length > 0) {
      throw new AppError("priceAtPurchase is required for all products", 400);
    }

    // Create broadcast
    const broadcast = await Broadcast.create({
      customerId,
      products,
      location: {
        type: "Point",
        coordinates,
      },
      paymentDetails,
      deliveryAddress,
      totalAmount,
      grandTotal,
      status: "pending",
    });

    try {
      // Find nearby retailers (5km radius)
      const retailers = await Retailer.find({
        "location.coordinates": {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates,
            },
            $maxDistance: 5000, // 5km in meters
          },
        },
        isActive: true,
      }).select("_id");

      // Update broadcast with potential retailers
      broadcast.potentialRetailers = retailers.map((r) => ({
        retailerId: r._id,
      }));
      await broadcast.save();

      return broadcast;
    } catch (err) {
      console.error("Error finding nearby retailers:", err);
      throw new AppError("Error processing broadcast", 500);
    }
  }

  // @desc    Get customer's active broadcasts
  // @route   GET /api/customers/broadcasts
  // @access  Private
  static async getCustomerBroadcasts(userId) {
    return await Broadcast.find({
      customerId: userId,
      status: { $in: ["pending", "accepted"] },
    }).sort("-createdAt");
  }

  // @desc    Get broadcast details
  // @route   GET /api/customers/broadcasts/:id
  // @access  Private
  static async getBroadcastDetails(userId, broadcastId) {
    const broadcast = await Broadcast.findOne({
      _id: broadcastId,
      customerId: userId,
    }).populate("potentialRetailers.retailerId", "name location");

    if (!broadcast) {
      throw new AppError("Broadcast not found", 404);
    }

    return broadcast;
  }

  // @desc    Cancel broadcast
  // @route   PATCH /api/customers/broadcasts/:id/cancel
  // @access  Private
  static async cancelBroadcast(userId, broadcastId) {
    const broadcast = await Broadcast.findOneAndUpdate(
      {
        _id: broadcastId,
        customerId: userId,
        status: "pending",
      },
      { status: "cancelled" },
      { new: true }
    );

    if (!broadcast) {
      throw new AppError(
        "Broadcast not found or already accepted/cancelled",
        400
      );
    }

    return broadcast;
  }
}

module.exports = CustomerService;
