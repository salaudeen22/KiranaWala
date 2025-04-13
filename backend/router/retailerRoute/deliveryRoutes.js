const express = require("express");
const router = express.Router();
const deliveryController = require("../../controller/deliveryController");
const { protect, authorize } = require("../../middleware/authMiddleware");

// Delivery personnel management
router.post(
  "/",
  protect,
  authorize("admin"),
  deliveryController.createDeliveryPerson
);

router.get(
  "/",
  protect,
  authorize("admin", "manager"),
  deliveryController.getDeliveryPersons
);

// Delivery operations
router.get(
  "/my-deliveries",
  protect,
  authorize("delivery_coordinator"),
  deliveryController.getMyDeliveries
);
router.post(
  "/assign",
  protect,
  authorize("admin", "manager"),
  deliveryController.assignDelivery
);

router.patch(
  "/:broadcastId/status",
  protect,
  authorize("delivery_coordinator"),
  deliveryController.updateDeliveryStatus
);

// Location-based queries
router.get(
  "/nearby",
  protect,
  authorize("admin", "manager"),
  deliveryController.getNearbyDeliveryPersons
);

module.exports = router;