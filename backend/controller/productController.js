const ProductService = require('../service/productService');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Public endpoints
exports.getPublicProductsByRetailer = asyncHandler(async (req, res) => {
  const products = await ProductService.getPublicProducts(req.params.retailerId);
  res.status(200).json({ success: true, data: products });
});

exports.getAllPublicProducts=asyncHandler(async (req, res) => {
  const products = await ProductService.getAllPublicProducts();
  res.status(200).json({ success: true, data: products });
});

exports.getPublicProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.getPublicProduct(
    req.params.retailerId,
    req.params.id
  );
  res.status(200).json({ success: true, data: product });
});

exports.searchPublicProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.searchPublicProducts(
    req.params.retailerId,
    req.params.query
  );
  res.status(200).json({ success: true, data: products });
});

exports.getPublicCategories = asyncHandler(async (req, res) => {
  const categories = await ProductService.getPublicCategories(req.params.retailerId);
  res.status(200).json({ success: true, data: categories });
});

// Protected endpoints
exports.getAllProductsForRetailer = asyncHandler(async (req, res) => {
  const products = await ProductService.getProductsForRetailer(req.user.retailerId);
  res.status(200).json({ success: true, data: products });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(
    req.params.id,
    req.user.retailerId
  );
  res.status(200).json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    retailerId: req.user.retailerId
  };
  const product = await ProductService.createProduct(productData);
  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.updateProduct(
    req.params.id,
    req.user.retailerId,
    req.body
  );
  res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await ProductService.deleteProduct(
    req.params.id,
    req.user.retailerId
  );
  res.status(204).json({ success: true, data: null });
});

exports.updateStock = asyncHandler(async (req, res) => {
  const product = await ProductService.updateStock(
    req.params.id,
    req.user.retailerId,
    req.body.stock
  );
  res.status(200).json({ success: true, data: product });
});

exports.getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 5;
  const products = await ProductService.getLowStockProducts(
    req.user.retailerId,
    threshold
  );
  res.status(200).json({ success: true, data: products });
});

exports.searchProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.searchProducts(
    req.user.retailerId,
    req.params.query
  );
  res.status(200).json({ success: true, data: products });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.status(200).json({ success: true, data: categories });
});

exports.getProductByName = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductByName(
    req.user.retailerId,
    req.params.name
  );
  res.status(200).json({ success: true, data: product });
});

exports.getProductByBarcode = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductByBarcode(
    req.user.retailerId,
    req.params.barcode
  );
  res.status(200).json({ success: true, data: product });
});

exports.bulkUploadProducts = asyncHandler(async (req, res, next) => {
  console.log("Uploaded file:", req.file); // Debugging log

  if (!req.file) {
    return next(new AppError("No file uploaded", 400)); // Ensure this error is clear
  }

  try {
    // Process the uploaded file (e.g., Excel file)
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const retailerId = req.user.retailerId;
    const products = sheetData.map((product) => ({
      ...product,
      retailerId,
    }));

    const createdProducts = await ProductService.bulkCreateProducts(products);

    // Delete the temporary file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      data: createdProducts,
    });
  } catch (error) {
    console.error("Error processing bulk upload:", error);
    return next(new AppError("Failed to process the uploaded file", 500));
  }
});

exports.downloadTemplate = asyncHandler(async (req, res, next) => {
  const filePath = path.join(__dirname, '../../templates/product_template.xlsx');
  res.download(filePath, 'product_template.xlsx', (err) => {
    if (err) {
      console.error('Error sending template file:', err);
      return next(new AppError('Failed to download template', 500));
    }
  });
});