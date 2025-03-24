const express = require("express");
const router = express.Router();
const analyticsController = require("../../controller/analyticsController");

router.get("/count", analyticsController.getTotalOrders);
router.get("/pending", analyticsController.getPendingOrders);
router.get("/status-breakdown", analyticsController.getOrderStatusBreakdown);
router.get("/revenue", analyticsController.getTotalRevenue);
router.get("/top-products", analyticsController.getTopSellingProducts);
router.get("/trends", analyticsController.getOrderTrends);
router.get("/payment-methods", analyticsController.getPaymentMethodAnalytics);

module.exports = router;