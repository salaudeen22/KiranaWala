const Product = require("../model/productSchema");
const Vendor = require("../model/vendorSchema");

class ProductService {
  static async addProduct(retailerId, productData) {
    retailerId = Number(retailerId);
    const product = new Product({ ...productData, retailerId });
    await product.save();

    await Vendor.findOneAndUpdate(
      { retailerId },
      {
        $push: {
          inventory: {
            productId: product.productId,
            quantity: Number(product.stock),
          },
        },
      },
      { new: true }
    );

    return product;
  }

  static async getAllProducts() {
    return await Product.find();
  }

  static async getProductById(id) {
    return await Product.findOne({ productId: id });
  }

  static async getProductsByCategory(category) {
    return await Product.find({ category });
  }

  static async updateProduct(id, updatedData) {
    return await Product.findOneAndUpdate({ productId: id }, updatedData, {
      new: true,
    });
  }

  static async deleteProduct(id) {
    const product = await Product.findOneAndDelete({ productId: id });

    if (product) {
      await Vendor.findOneAndUpdate(
        { retailerId: product.retailerId },
        { $pull: { inventory: { productId: product.productId } } },
        { new: true }
      );
    }

    return product;
  }

  static async getLowStockProducts() {
    return await Product.find({ stock: { $lt: 10 } });
  }

  static async getAvailableProducts() {
    return await Product.find({ isAvailable: true });
  }
}

module.exports = ProductService;
