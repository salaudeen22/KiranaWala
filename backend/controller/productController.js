const ProductService = require('../service/productService');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');

// @desc    Get all products for current retailer
// @route   GET /api/products
// @access  Private
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getProducts(
    { isAvailable: true },
    req.user.retailerId
  );
  res.status(200).json({ success: true, data: products });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  // For public access, don't filter by retailerId
  const product = await ProductService.getProductById(req.params.id);
  res.status(200).json({ success: true, data: product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin/Manager)
exports.createProduct = asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    retailerId: req.user.retailerId || req.user.storesOwned?.[0]
  };
  const product = await ProductService.createProduct(productData);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Manager/Inventory Staff)
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.updateProduct(
    req.params.id,
    req.user.retailerId,
    req.body
  );
  res.status(200).json({ success: true, data: product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = asyncHandler(async (req, res) => {
  await ProductService.deleteProduct(req.params.id, req.user.retailerId);
  res.status(200).json({ success: true, data: {} });
});

// @desc    Update stock
// @route   PATCH /api/products/:id/stock
// @access  Private (Admin/Manager/Inventory Staff)
exports.updateStock = asyncHandler(async (req, res) => {
  const product = await ProductService.updateStock(
    req.params.id,
    req.user.retailerId,
    req.body.stock
  );
  res.status(200).json({ success: true, data: product });
});

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private (Admin/Manager)
exports.getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 5;
  const products = await ProductService.getLowStockProducts(
    threshold,
    req.user.retailerId
  );
  res.status(200).json({ success: true, data: products });
});

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
exports.searchProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.searchProducts(
    req.params.query,
    req.query.retailerId // For public search, pass retailerId as query param
  );
  res.status(200).json({ success: true, data: products });
});

// @desc    Get all categories
// @route   GET /api/products/categories/all
// @access  Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await ProductService.getAllCategories(
    req.query.retailerId // For public access, pass retailerId as query param
  );
  res.status(200).json({ success: true, data: categories });
});

// @desc    Get retailer's products
// @route   GET /api/products/retailer/:retailerId
// @access  Public
exports.getProductsByRetailer = asyncHandler(async (req, res) => {
  const products = await ProductService.getProducts(
    { isAvailable: true },
    req.params.retailerId
  );
  res.status(200).json({ success: true, data: products });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id, req.user?.retailerId);
  res.status(200).json({ success: true, data: product });
});

exports.getProductByName = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductByName(
    req.params.name,
    req.user?.retailerId
  );
  res.status(200).json({ success: true, data: product });
});

exports.getProductByBarcode = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductByBarcode(
    req.params.barcode,
    req.user?.retailerId
  );
  res.status(200).json({ success: true, data: product });
});