const retailerService = require("../service/retailerService");
const employeeService = require("../service/employeeService");
const Retailer = require("../model/vendorSchema");
const Broadcast = require("../model/BroadcastSchema");
const Delivery = require("../model/Delivery");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { createSendToken } = require("../utils/auth");

// Create a new retailer
exports.createRetailer = async (req, res) => {
  try {
    const retailer = await retailerService.createRetailer(req.body);
    res.status(201).json({
      success: true,
      data: retailer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if retailer exists and password is correct
    const retailer = await Retailer.findOne({ 'contact.email': email }).select('+password');

    if (!retailer || !(await retailer.correctPassword(password, retailer.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Check if account is active
    if (!retailer.isActive) {
      return next(new AppError('Your account has been deactivated', 403));
    }

    // 4) If everything ok, send token to client
    createSendToken(retailer, 200, res);
  } catch (error) {
    next(error);
  }
};

// Get all retailers
exports.getAllRetailers = async (req, res) => {
  try {
    const retailers = await retailerService.getAllRetailers();
    res.status(200).json({
      success: true,
      data: retailers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single retailer
exports.getRetailer = async (req, res) => {
  try {
    const retailer = await retailerService.getRetailerById(req.user.id);
    if (!retailer) {
      return res.status(404).json({
        success: false,
        message: "Retailer not found",
      });
    }
    res.status(200).json({
      success: true,
      data: retailer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update retailer
exports.updateRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.user.id);

    if (retailer) {
      // Update existing retailer
      const updatedRetailer = await Retailer.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        success: true,
        data: updatedRetailer,
      });
    } else {
      // Create new retailer
      const newRetailer = await Retailer.create({
        ...req.body,
        ownerId: req.user.id,
      });
      return res.status(201).json({
        success: true,
        data: newRetailer,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete retailer
exports.deleteRetailer = async (req, res) => {
  try {
    await retailerService.deleteRetailer(req.user.id);
    res.status(204).json({
      success: true,
      data: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// retailerController.js
exports.createEmployeeForRetailer = async (req, res) => {
  try {
    const employeeData = req.body;
    const retailerId=req.user.id;
    console.log("Controller"+employeeData);

 
    employeeData.retailerId = retailerId;

    const employee = await employeeService.createEmployee(employeeData);
    // console.log("employye"+employee);

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// controller/retailerController.js
exports.getAvailableBroadcasts = asyncHandler(async (req, res, next) => {
  const retailer = await Retailer.findById(req.user.retailerId)
    .select('location serviceAreas.pincode')
    .lean();

  if (!retailer?.location?.coordinates) {
    return next(new AppError('Retailer location not configured', 400));
  }

  const broadcasts = await Broadcast.find({
    status: 'pending',
    'deliveryAddress.pincode': { $in: retailer.serviceAreas.map(a => a.pincode) },
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: retailer.location.coordinates
        },
        $maxDistance: 5000
      }
    }
  })
  .populate('customerId', 'name phone')
  .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: broadcasts
  });
});

exports.acceptBroadcast = asyncHandler(async (req, res, next) => {
  const broadcast = await Broadcast.findOneAndUpdate(
    {
      _id: req.params.id,
      status: "pending",
      expiryTime: { $gt: new Date() },
    },
    {
      status: "accepted",
      retailerId: req.user.retailerId,
      acceptedAt: new Date(),
    },
    { new: true }
  );

  if (!broadcast) {
    return next(new AppError("Broadcast no longer available", 400));
  }

  // Notify customer
  const io = req.app.get("io");
  io.to(`customer_${broadcast.customerId}`).emit("broadcast_accepted", broadcast);

  res.status(200).json({
    success: true,
    data: broadcast,
  });
});

exports.updateServiceArea = async (req, res) => {
  try {
    const { retailerId, serviceablePincodes } = req.body;

    if (!retailerId || !serviceablePincodes) {
      return res.status(400).json({ message: 'Retailer ID and serviceable pincodes are required.' });
    }

    const retailer = await Retailer.findByIdAndUpdate(
      retailerId,
      { serviceablePincodes },
      { new: true }
    );

    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found.' });
    }

    res.status(200).json({ message: 'Service area updated successfully.', retailer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service area.', error });
  }
};
