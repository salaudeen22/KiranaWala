const retailerService = require('../service/retailerService');
const employeeService=require("../service/employeeService");
const Retailer=require("../model/vendorSchema");
const Broadcast=require("../model/BroadcastSchema");
const Delivery=require("../model/Delivery");
const asyncHandler=require("express-async-handler");

// Create a new retailer
exports.createRetailer = async (req, res) => {
  try {
    const retailer = await retailerService.createRetailer(req.body);
    res.status(201).json({
      success: true,
      data: retailer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all retailers
exports.getAllRetailers = async (req, res) => {
  try {
    const retailers = await retailerService.getAllRetailers();
    res.status(200).json({
      success: true,
      data: retailers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single retailer
exports.getRetailer = async (req, res) => {
  try {
    const retailer = await retailerService.getRetailerById(req.params.id);
    if (!retailer) {
      return res.status(404).json({
        success: false,
        message: 'Retailer not found'
      });
    }
    res.status(200).json({
      success: true,
      data: retailer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update retailer
exports.updateRetailer = async (req, res) => {
  try {
    const retailer = await retailerService.updateRetailer(
      req.params.id,
      req.body
    );
    if (!retailer) {
      return res.status(404).json({
        success: false,
        message: 'Retailer not found'
      });
    }
    res.status(200).json({
      success: true,
      data: retailer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete retailer
exports.deleteRetailer = async (req, res) => {
  try {
    await retailerService.deleteRetailer(req.params.id);
    res.status(204).json({
      success: true,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// retailerController.js
exports.createEmployeeForRetailer = async (req, res) => {
  try {
   
    const employeeData = req.body;
    // console.log("Controller"+employeeData);

    // Set the retailerId from the route parameter
    // employeeData.retailerId = retailerId;

    const employee = await employeeService.createEmployee(employeeData);
    // console.log("employye"+employee);
    
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAvailableBroadcasts = asyncHandler(async (req, res, next) => {
  // 1. Get retailer's service area pincodes
  const retailer = await Retailer.findById(req.user.retailerId)
    .select('serviceAreas.pincode');
    
  const pincodes = retailer.serviceAreas.map(area => area.pincode);

  // 2. Find broadcasts in service area
  const broadcasts = await Broadcast.find({
    status: "pending",
    "deliveryAddress.pincode": { $in: pincodes },
    "location.coordinates": {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: retailer.location.coordinates
        },
        $maxDistance: 5000 // 5km
      }
    }
  }).sort('-createdAt');

  res.status(200).json({
    success: true,
    data: broadcasts
  });
});

exports.acceptBroadcast = asyncHandler(async (req, res, next) => {
  // 1. Verify broadcast is still available
  const broadcast = await Broadcast.findOneAndUpdate(
    {
      _id: req.params.id,
      status: "pending",
      expiryTime: { $gt: new Date() }
    },
    {
      status: "accepted",
      retailerId: req.user.retailerId,
      acceptedAt: new Date()
    },
    { new: true }
  );

  if (!broadcast) {
    return next(new AppError("Broadcast no longer available", 400));
  }

  // 2. Assign delivery person (optimized)
  const deliveryPerson = await Delivery.findOneAndUpdate(
    {
      retailerId: req.user.retailerId,
      isAvailable: true
    },
    { isAvailable: false },
    { sort: { rating: -1 }, new: true }
  );

  if (deliveryPerson) {
    broadcast.deliveryPersonId = deliveryPerson._id;
    await broadcast.save();
  }

  // 3. Notify customer
  if (io) {
    io.to(`customer_${broadcast.customerId}`).emit('broadcast_accepted', broadcast);
  }

  res.status(200).json({
    success: true,
    data: broadcast
  });
});