const Customer = require('../model/customerSchema');
const asyncHandler = require('express-async-handler');
const { signToken, createSendToken } = require('../utils/auth');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const CustomerService=require("../service/customerService");
const { v4: uuidv4 } = require('uuid');
const Product=require("../model/productSchema");
const Retailer=require("../model/vendorSchema");

const  Broadcast=require("../model/BroadcastSchema");
const BroadcastService=require("../service/BroadcastService");

// @desc    Register customer
// @route   POST /api/customers/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // 1) Check if customer exists
  const customerExists = await Customer.findOne({ $or: [{ email }, { phone }] });
  if (customerExists) {
    return next(new AppError('Customer with this email or phone already exists', 400));
  }

  // 2) Create new customer
  const customer = await Customer.create({
    name,
    email,
    phone,
    password
  });

  // 3) Generate token and send response
  createSendToken(customer, 201, res);
});

// @desc    Login customer
// @route   POST /api/customers/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if customer exists
  const customer = await Customer.findOne({ email }).select('+password');
  
  if (!customer) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Verify password
  try {
    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Incorrect email or password', 401));
    }
    
    // 4) Generate token and send response
    createSendToken(customer, 200, res);
  } catch (err) {
    console.error('Password comparison error:', err);
    return next(new AppError('Login failed', 500));
  }
});

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const customer = await Customer.findById(req.user.id) .select('-password -__v');
  
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  // 1) Filter out unwanted fields
  const filteredBody = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  // 2) Update customer
  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: updatedCustomer
  });
});

exports.getAllAddress = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.user.id).select('address');
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }
  res.status(200).json({
    success: true,
    data: customer.address
  });
});

// @desc    Add address
// @route   POST /api/customers/address
// @access  Private
exports.addAddress = asyncHandler(async (req, res, next) => {
  try {
    const { id: customerId } = req.user; // Ensure customerId is correctly retrieved
    const newAddress = req.body;

    // Generate a unique addressId
    newAddress.addressId = uuidv4();

    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    // Handle case where customer is not found
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if the address already exists
    const isDuplicate = customer.address.some(
      (addr) =>
        addr.street === newAddress.street &&
        addr.city === newAddress.city &&
        addr.state === newAddress.state &&
        addr.pincode === newAddress.pincode
    );

    if (isDuplicate) {
      return res.status(400).json({ message: "Address already exists" });
    }

    // Add the new address
    customer.address.push(newAddress);

    // Save the customer document
    await customer.save();

    res.status(201).json({ message: "Address added successfully", data: customer.address });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
});

// @desc    Delete address
// @route   DELETE /api/customers/address/:addressId
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.user.id);

  // 1) Find address index
  const addressIndex = customer.address.findIndex(
    addr => addr._id.toString() === req.params.addressId
  );

  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404));
  }

  // 2) Remove address
  customer.address.splice(addressIndex, 1);
  await customer.save();

  res.status(200).json({
    success: true,
    data: customer.address
  });
});

// @desc    Update password
// @route   PATCH /api/customers/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.user.id).select('+password');

  // 1) Check if current password is correct
  if (!(await customer.comparePassword(req.body.currentPassword, customer.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 2) Update password
  customer.password = req.body.newPassword;
  await customer.save();

  // 3) Log customer in with new token
  createSendToken(customer, 200, res);
});

// @desc    Delete account
// @route   DELETE /api/customers/profile
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  await CustomerService.deleteAccount(req.user.id);
  res.status(204).json({ success: true, data: null });
});

// @desc    Update address
// @route   PUT /api/customers/address/:addressId
// @access  Private
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const addresses = await CustomerService.updateAddress(
    req.user.id,
    req.params.addressId,
    req.body
  );
  res.status(200).json({ success: true, data: addresses });
});

// @desc    Get wallet balance
// @route   GET /api/customers/wallet
// @access  Private
exports.getWallet = asyncHandler(async (req, res, next) => {
  const balance = await CustomerService.getWallet(req.user.id);
  res.status(200).json({ success: true, data: { balance } });
});

// @desc    Top up wallet
// @route   POST /api/customers/wallet/topup
// @access  Private
exports.topUpWallet = asyncHandler(async (req, res, next) => {
  const customer = await CustomerService.topUpWallet(
    req.user.id,
    req.body.amount
  );
  res.status(200).json({ success: true, data: customer });
});

// @desc    Get wishlist
// @route   GET /api/customers/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await CustomerService.getWishlist(req.user.id);
  res.status(200).json({ success: true, data: wishlist });
});

// @desc    Add to wishlist
// @route   POST /api/customers/wishlist/:productId
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await CustomerService.addToWishlist(
    req.user.id,
    req.params.productId
  );
  res.status(200).json({ success: true, data: wishlist });
});

// @desc    Remove from wishlist
// @route   DELETE /api/customers/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await CustomerService.removeFromWishlist(
    req.user.id,
    req.params.productId
  );
  res.status(200).json({ success: true, data: wishlist });
});

// @desc    Create product broadcast
// @route   POST /api/customers/broadcasts
// @access  Private
exports.createBroadcast = asyncHandler(async (req, res, next) => {
  const { products, coordinates, paymentMethod, deliveryAddress } = req.body;

  // Validate coordinates format
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return next(new AppError('Invalid coordinates format', 400));
  }

  // Create broadcast
  const broadcast = await BroadcastService.createBroadcast({
    customerId: req.user.id,
    products: products.map(p => ({
      productId: p.productId,
      quantity: p.quantity
    })),
    coordinates,
    paymentMethod,
    deliveryAddress
  });

  // Find and notify eligible retailers
  const io = req.app.get("io");
  try {
    const retailers = await BroadcastService.findEligibleRetailers(
      coordinates,
      deliveryAddress.pincode
    );

    // Notify each retailer
    retailers.forEach(retailer => {
      io.to(`retailer_${retailer._id}`).emit('new_broadcast', {
        ...broadcast.toObject(),
        distance: retailer.distance // Added by geospatial query
      });
    });

    console.log(`Notified ${retailers.length} retailers`);
  } catch (error) {
    console.error('Retailer notification failed:', error);
  }

  res.status(201).json({
    success: true,
    data: broadcast
  });
});

// @desc    Get customer's active broadcasts
// @route   GET /api/customers/broadcasts
// @access  Private
exports.getCustomerBroadcasts = asyncHandler(async (req, res, next) => {
  const broadcasts = await CustomerService.getCustomerBroadcasts(req.user.id);
  res.status(200).json({
    success: true,
    data: broadcasts
  });
});

// @desc    Get broadcast details
// @route   GET /api/customers/broadcasts/:id
// @access  Private
exports.getBroadcastDetails = asyncHandler(async (req, res, next) => {
  const broadcast = await CustomerService.getBroadcastDetails(
    req.user.id,
    req.params.id
  );
  res.status(200).json({
    success: true,
    data: broadcast
  });
});

// @desc    Cancel broadcast
// @route   PATCH /api/customers/broadcasts/:id/cancel
// @access  Private
exports.cancelBroadcast = asyncHandler(async (req, res, next) => {
  const broadcast = await CustomerService.cancelBroadcast(
    req.user.id,
    req.params.id
  );
  res.status(200).json({
    success: true,
    data: broadcast
  });
});

// Add these to your existing exports

// @desc    Get customer orders
// @route   GET /api/customers/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await CustomerService.getOrders(req.user.id);
  res.status(200).json({
    success: true,
    data: orders
  });
});

// @desc    Get order details
// @route   GET /api/customers/orders/:id
// @access  Private
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await CustomerService.getOrderDetails(
    req.user.id,
    req.params.id
  );
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Place an order
// @route   POST /api/customers/orders
// @access  Private
exports.placeOrder = asyncHandler(async (req, res, next) => {
  const order = await CustomerService.placeOrder(
    req.user.id,
    req.body
  );
  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Cancel an order
// @route   PATCH /api/customers/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await CustomerService.cancelOrder(
    req.user.id,
    req.params.id
  );
  res.status(200).json({
    success: true,
    data: order
  });
});

