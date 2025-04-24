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

// @desc    Get broadcast analytics
// @route   GET /api/analytics/broadcasts
// @access  Private (Admin/Manager)
exports.getBroadcastAnalytics = asyncHandler(async (req, res) => {
  const { timeRange = "30d" } = req.query;
  const data = await analyticsService.getBroadcastAnalytics(timeRange);
  res.json({ success: true, data });
});

// @desc    Get order analytics
// @route   GET /api/analytics/orders
// @access  Private (Admin/Manager)
exports.getOrderAnalytics = asyncHandler(async (req, res) => {
  const { timeRange = "30d" } = req.query;
  const data = await analyticsService.getOrderAnalytics(timeRange);
  res.json({ success: true, data });
});

// @desc    Get top customers by spending
// @route   GET /api/analytics/top-customers
// @access  Private (Admin/Manager)
exports.getTopCustomers = asyncHandler(async (req, res) => {
  const { timeRange = '30d', limit = 5, retailerId } = req.query;
  const data = await analyticsService.getTopCustomers(timeRange, limit, retailerId);
  res.json({ success: true, data });
});

// @desc    Get top categories by revenue
// @route   GET /api/analytics/top-categories
// @access  Private (Admin/Manager)
exports.getTopCategories = asyncHandler(async (req, res) => {
  const { timeRange = '30d', limit = 5, retailerId } = req.query;
  const data = await analyticsService.getTopCategories(timeRange, limit, retailerId);
  res.json({ success: true, data });
});

// @desc    Get customer retention rate
// @route   GET /api/analytics/customer-retention
// @access  Private (Admin/Manager)
exports.getCustomerRetentionRate = asyncHandler(async (req, res) => {
  const { timeRange = '30d', retailerId } = req.query;
  const data = await analyticsService.getCustomerRetentionRate(timeRange, retailerId);
  res.json({ success: true, data });
});