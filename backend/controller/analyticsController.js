const analyticsService = require('../service/analyticsService');
const asyncHandler = require('express-async-handler');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private (Admin/Manager)
exports.getSalesAnalytics = asyncHandler(async (req, res) => {
  const { timeRange = '30d', retailerId } = req.query;
  const data = await analyticsService.getSalesAnalytics(timeRange, retailerId);
  res.json({ success: true, data });
});

// @desc    Get sales by product
// @route   GET /api/analytics/sales-by-product
// @access  Private (Admin/Manager)
exports.getSalesByProduct = asyncHandler(async (req, res) => {
  const { timeRange = '30d', limit = 5, retailerId } = req.query;
  const data = await analyticsService.getSalesByProduct(timeRange, limit, retailerId);
  res.json({ success: true, data });
});

// @desc    Get sales by category
// @route   GET /api/analytics/sales-by-category
// @access  Private (Admin/Manager)
exports.getSalesByCategory = asyncHandler(async (req, res) => {
  const { timeRange = '30d', retailerId } = req.query;
  const data = await analyticsService.getSalesByCategory(timeRange, retailerId);
  res.json({ success: true, data });
});

// @desc    Get customer activity
// @route   GET /api/analytics/customer-activity
// @access  Private (Admin/Manager)
exports.getCustomerActivity = asyncHandler(async (req, res) => {
  const { timeRange = '30d', retailerId } = req.query;
  const data = await analyticsService.getCustomerActivity(timeRange, retailerId);
  res.json({ success: true, data });
});

// @desc    Get customer segments
// @route   GET /api/analytics/customer-segments
// @access  Private (Admin/Manager)
exports.getCustomerSegments = asyncHandler(async (req, res) => {
  const { retailerId } = req.query;
  const data = await analyticsService.getCustomerSegments(retailerId);
  res.json({ success: true, data });
});

// @desc    Get inventory turnover
// @route   GET /api/analytics/inventory-turnover
// @access  Private (Admin/Manager)
exports.getInventoryTurnover = asyncHandler(async (req, res) => {
  const { timeRange = '30d', retailerId } = req.query;
  const data = await analyticsService.getInventoryTurnover(timeRange, retailerId);
  res.json({ success: true, data });
});

// @desc    Get stock levels
// @route   GET /api/analytics/stock-levels
// @access  Private (Admin/Manager)
exports.getStockLevels = asyncHandler(async (req, res) => {
  const { threshold = 5, retailerId } = req.query;
  const data = await analyticsService.getStockLevels(threshold, retailerId);
  res.json({ success: true, data });
});

// @desc    Get delivery performance
// @route   GET /api/analytics/delivery-performance
// @access  Private (Admin/Manager)
exports.getDeliveryPerformance = asyncHandler(async (req, res) => {
  const { timeRange = '30d', retailerId } = req.query;
  const data = await analyticsService.getDeliveryPerformance(timeRange, retailerId);
  res.json({ success: true, data });
});