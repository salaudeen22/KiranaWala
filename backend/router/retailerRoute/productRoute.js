const express = require("express");
const ProductController = require("../../controller/productController");

const router = express.Router();

router.get("/inventory", ProductController.getAllProducts);
router.get("/total-stock-value", ProductController.getTotalStockValue);
router.get("/low-stock", ProductController.getLowStockProducts);
router.get("/out-of-stock", ProductController.getOutOfStockProducts);
router.post("/add-product", ProductController.addProduct);
router.put("/update-product/:id", ProductController.updateProduct);
router.delete("/delete-product/:id", ProductController.deleteProduct);
router.get("/sales-analytics", ProductController.getSalesAnalytics);
router.get("/profit-margin", ProductController.getProfitMargin);
router.get("/top-selling-products", ProductController.getTopSellingProducts);
router.get("/dead-stock", ProductController.getDeadStock);

module.exports = router;
