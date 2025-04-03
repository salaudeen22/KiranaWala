const Product = require('../model/productSchema');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

class ProductService {
  // Create product with retailer validation
  static async createProduct(productData) {
    return await Product.create(productData);
  }

  // Get products with retailer filter
  static async getProducts(filter = {}, retailerId) {
    return await Product.find({ ...filter, retailerId });
  }

  // Get single product with retailer check
  static async getProductById(productId, retailerId) {
    const product = await Product.findOne({ _id: productId, retailerId });
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  // Update product with retailer validation
  static async updateProduct(productId, retailerId, updateData) {
    const product = await Product.findOneAndUpdate(
      { _id: productId, retailerId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!product) throw new AppError('Product not found or not authorized', 404);
    return product;
  }

  // Update stock with retailer validation
  static async updateStock(productId, retailerId, newStock) {
    const product = await Product.findOne({ _id: productId, retailerId });
    if (!product) throw new AppError('Product not found', 404);

    product.stock = newStock;
    await product.save();
    return product;
  }

  // Get low stock products for retailer
  static async getLowStockProducts(threshold = 5, retailerId) {
    return await Product.find({ 
      stock: { $lt: threshold },
      retailerId 
    }).sort({ stock: 1 });
  }

  // Search products within retailer's inventory
  static async searchProducts(query, retailerId) {
    return await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      retailerId,
      isAvailable: true
    });
  }

  // Get all categories for retailer
  static async getAllCategories(retailerId) {
    return await Product.distinct('category', { retailerId });
  }

  // Delete product with retailer validation
  static async deleteProduct(productId, retailerId) {
    const product = await Product.findOneAndDelete({ 
      _id: productId, 
      retailerId 
    });
    if (!product) throw new AppError('Product not found or not authorized', 404);
    return { success: true };
  }

  // Get product by ID or barcode

  static async getProductById(productId, retailerId) {
    const query = { _id: productId };
    if (retailerId) query.retailerId = retailerId;
    
    const product = await Product.findOne(query);
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  // Get product by name or barcode

  static async getProductByName(name, retailerId) {
    const query = { 
      name: { $regex: new RegExp(name, 'i') } // Case-insensitive search
    };
    if (retailerId) query.retailerId = retailerId;

    const product = await Product.findOne(query);
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  // Get product by barcode

  static async getProductByBarcode(barcode, retailerId) {
    const query = { barcode };
    if (retailerId) query.retailerId = retailerId;

    const product = await Product.findOne(query);
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }
}

module.exports = ProductService;