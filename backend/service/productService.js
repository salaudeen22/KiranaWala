const Product = require('../model/productSchema');
const AppError = require('../utils/appError');

class ProductService {
  // Public methods
  static async getPublicProducts(retailerId) {
    return await Product.find({ 
      retailerId,
      isAvailable: true 
    }).select('-internalNotes -costPrice');
  }

  static async getPublicProduct(retailerId, productId) {
    const product = await Product.findOne({ 
      _id: productId,
      retailerId,
      isAvailable: true 
    }).select('-internalNotes -costPrice');
    
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  static async searchPublicProducts(retailerId, query) {
    return await Product.find({
      retailerId,
      isAvailable: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).select('-internalNotes -costPrice');
  }

  static async getPublicCategories(retailerId) {
    return await Product.distinct('category', { 
      retailerId,
      isAvailable: true 
    });
  }

  // Protected methods
  static async getProductsForRetailer(retailerId) {
    return await Product.find({ retailerId });
  }

  static async getProductById(productId, retailerId) {
    const product = await Product.findOne({ 
      _id: productId,
      retailerId 
    });
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  static async createProduct(productData) {
    return await Product.create(productData);
  }

  static async updateProduct(productId, retailerId, updateData) {
    const product = await Product.findOneAndUpdate(
      { _id: productId, retailerId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!product) throw new AppError('Product not found or not authorized', 404);
    return product;
  }

  static async deleteProduct(productId, retailerId) {
    const product = await Product.findOneAndDelete({ 
      _id: productId, 
      retailerId 
    });
    if (!product) throw new AppError('Product not found or not authorized', 404);
    return product;
  }

  static async updateStock(productId, retailerId, newStock) {
    const product = await Product.findOneAndUpdate(
      { _id: productId, retailerId },
      { stock: newStock },
      { new: true }
    );
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  static async getLowStockProducts(retailerId, threshold = 5) {
    return await Product.find({ 
      retailerId,
      stock: { $lt: threshold }
    }).sort({ stock: 1 });
  }

  static async searchProducts(retailerId, query) {
    return await Product.find({
      retailerId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { barcode: query } // Exact match for barcode
      ]
    });
  }

  static async getCategories(retailerId) {
    return await Product.distinct('category', { retailerId });
  }

  static async getProductByName(retailerId, name) {
    const product = await Product.findOne({ 
      retailerId,
      name: { $regex: new RegExp(name, 'i') }
    });
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  static async getProductByBarcode(retailerId, barcode) {
    const product = await Product.findOne({ 
      retailerId,
      barcode 
    });
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }
}

module.exports = ProductService;