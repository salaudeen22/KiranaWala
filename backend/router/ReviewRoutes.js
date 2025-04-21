const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const { customerProtect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post(
  "/",
  customerProtect,
  reviewController.createReview
);

router.get("/me", customerProtect, reviewController.getMyReviews);

router.get("/retailer/:productId", reviewController.getRetailerReviews);

module.exports = router;
