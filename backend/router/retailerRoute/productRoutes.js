const express = require('express');
const router = express.Router();
const productController = require('../../controller/productController');
const authMiddleware = require('../../middleware/authMiddleware');

// Public routes
router.get('/public/all', productController.getAllPublicProducts);
router.get('/public/:retailerId', productController.getPublicProductsByRetailer);
router.get('/public/:retailerId/:id', productController.getPublicProduct);
router.get('/public/:retailerId/search/:query', productController.searchPublicProducts);
router.get('/public/:retailerId/categories', productController.getPublicCategories);

// Protected routes (require authentication)
router.use(authMiddleware.protect);

// Retailer-specific product management
router.post('/', 
  authMiddleware.authorize('admin', 'manager'), 
  productController.createProduct
);

router.get('/', productController.getAllProductsForRetailer);
router.get('/low-stock', 
  authMiddleware.authorize('admin', 'manager'), 
  productController.getLowStockProducts
);
router.get('/search/:query', productController.searchProducts);
router.get('/categories', productController.getCategories);

router.get('/:id', productController.getProduct);
router.get('/by-name/:name', productController.getProductByName);
router.get('/by-barcode/:barcode', productController.getProductByBarcode);

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