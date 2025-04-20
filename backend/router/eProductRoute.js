const express = require('express');
const router = express.Router();
const productController = require('../controller/eProduct');

// Route to fetch all products
router.get('/products', productController.getAllProducts);

// Route to fetch a single product by ID
router.get('/products/:productId', productController.getProductById);

// Route to add a new product
router.post('/products', productController.addProduct);

// Route to update an existing product
router.put('/products/:productId', productController.updateProduct);

module.exports = router;
