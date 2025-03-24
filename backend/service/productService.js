const Product = require("../model/productSchema");

class ProductService {
  static async getAllProducts() {
    return await Product.find();
  }

  static async getTotalStockValue() {
    const products = await Product.find();
    return products.reduce((sum, item) => sum + item.finalPrice * item.stock, 0);
  }

  static async getLowStockProducts() {
    return await Product.find({ stock: { $lte: 10 } });
  }

  static async getOutOfStockProducts() {
    return await Product.find({ stock: 0 });
  }

  static async addProduct(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  static async updateProduct(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  static async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  static async getSalesAnalytics() {
    return await Product.find().select("name ratings totalReviews");
  }

  static async getProfitMargin() {
    return { profitMargin: 25 }; // Placeholder
  }

  static async getTopSellingProducts() {
    return await Product.find().sort({ "ratings.totalReviews": -1 }).limit(5);
  }

  static async getDeadStock() {
    return await Product.find({ "ratings.totalReviews": 0 });
  }
}

module.exports = ProductService;
