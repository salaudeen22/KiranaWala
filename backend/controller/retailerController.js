const retailerService = require('../service/retailerService');
const employeeService=require("../service/employeeService");

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
    const { retailerId } = req.params;
    const employeeData = req.body;

    // Set the retailerId from the route parameter
    employeeData.retailerId = retailerId;

    const employee = await employeeService.createEmployee(employeeData);
    
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