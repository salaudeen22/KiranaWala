const ProductCatalog = require('../model/ProductCatalogSchema');
const AppError = require('../utils/appError');

// Fetch all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductCatalog.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(new AppError('Error fetching products', 500));
  }
};

// Add a new product
exports.addProduct = async (req, res, next) => {
  try {
    const { name, description, category, barcode, images, tags, variants, taxRate, isFeatured } = req.body;

    const newProduct = await ProductCatalog.create({
      name,
      description,
      category,
      barcode,
      images,
      tags,
      variants,
      taxRate,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    next(new AppError('Error adding product', 500));
  }
};

// Update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const updatedProduct = await ProductCatalog.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
    if (!updatedProduct) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppError('Error updating product', 500));
  }
};

// Fetch a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductCatalog.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(new AppError('Error fetching product', 500));
  }
};
