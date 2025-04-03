const express = require('express');
const router = express.Router();
const analyticsController = require('../../controller/analyticsController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Sales analytics
router.get('/sales', protect, authorize('admin', 'manager'), analyticsController.getSalesAnalytics);
router.get('/sales-by-product', protect, authorize('admin', 'manager'), analyticsController.getSalesByProduct);
router.get('/sales-by-category', protect, authorize('admin', 'manager'), analyticsController.getSalesByCategory);

// Customer analytics
router.get('/customer-activity', protect, authorize('admin', 'manager'), analyticsController.getCustomerActivity);
router.get('/customer-segments', protect, authorize('admin', 'manager'), analyticsController.getCustomerSegments);

// Inventory analytics
router.get('/inventory-turnover', protect, authorize('admin', 'manager'), analyticsController.getInventoryTurnover);
router.get('/stock-levels', protect, authorize('admin', 'manager'), analyticsController.getStockLevels);

// Delivery analytics
router.get('/delivery-performance', protect, authorize('admin', 'manager'), analyticsController.getDeliveryPerformance);

module.exports = router;