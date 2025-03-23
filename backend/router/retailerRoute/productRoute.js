const express = require("express");
const ProductController = require("../../controller/productController");

const router = express.Router();

router.post("/", ProductController.addProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.get("/category/:category", ProductController.getProductsByCategory);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);
router.get("/low-stock", ProductController.getLowStockProducts);
router.get("/available", ProductController.getAvailableProducts);

module.exports = router;
