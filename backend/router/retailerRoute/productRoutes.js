const express = require('express');
const router = express.Router();
const productController = require('../../controller/productController');
const authMiddleware = require('../../middleware/authMiddleware');



// Protected routes
router.use(authMiddleware.protect);

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.get('/search/:query', productController.searchProducts);
router.get('/categories/all', productController.getAllCategories);
router.get('/retailer/:retailerId', productController.getProductsByRetailer);

router.get('/by-id/:id', productController.getProductById); // For MongoDB ObjectId
router.get('/by-name/:name', productController.getProductByName); // For product name search
router.get('/by-barcode/:barcode', productController.getProductByBarcode); // For barcode search

// Specific routes before parameterized routes
router.get('/low-stock', 
  authMiddleware.authorize('admin', 'manager'), 
  productController.getLowStockProducts
);

// Product management routes
router.post('/', 
  authMiddleware.authorize('admin', 'manager'), 
  productController.createProduct
);
router.put('/:id', 
  authMiddleware.authorize('admin', 'manager', 'inventory_staff'), 
  productController.updateProduct
);
router.delete('/:id', 
  authMiddleware.authorize('admin'), 
  productController.deleteProduct
);
router.patch('/:id/stock', 
  authMiddleware.authorize('admin', 'manager', 'inventory_staff'), 
  productController.updateStock
);

module.exports = router;