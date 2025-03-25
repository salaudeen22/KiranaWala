const express = require("express");
const router = express.Router();
const analyticsController = require("../../controller/analyticsController");

router.get("/analytics", analyticsController.getOrderAnalytics);

module.exports = router;