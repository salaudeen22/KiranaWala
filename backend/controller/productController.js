const ProductService = require("../service/productService");

class ProductController {
  static async addProduct(req, res) {
    try {
      const { retailerId, ...productData } = req.body;
      const product = await ProductService.addProduct(retailerId, productData);
      res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getProductsByCategory(req, res) {
    try {
      const products = await ProductService.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product updated successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const product = await ProductService.deleteProduct(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getLowStockProducts(req, res) {
    try {
      const products = await ProductService.getLowStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getAvailableProducts(req, res) {
    try {
      const products = await ProductService.getAvailableProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = ProductController;
