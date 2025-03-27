const ProductService = require("../service/productService");

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getTotalStockValue(req, res) {
    try {
      const totalStockValue = await ProductService.getTotalStockValue();
      res.json({ totalStockValue });
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

  static async getOutOfStockProducts(req, res) {
    try {
      const products = await ProductService.getOutOfStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async addProduct(req, res) {
    try {
      let productData = req.body;
      productData.finalPrice = productData.price - (productData.price * (productData.discount || 0)) / 100;

      const product = await ProductService.addProduct(productData);
      res.status(201).json({ message: "Product added successfully!", product });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      let productData = req.body;
      if (productData.price || productData.discount !== undefined) {
        productData.finalPrice = productData.price - (productData.price * (productData.discount || 0)) / 100;
      }

      const product = await ProductService.updateProduct(req.params.id, productData);
      res.json({ message: "Product updated successfully!", product });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      console.log(req.params.id);
      await ProductService.deleteProduct(req.params.id);
      console.log("Product deleted successfully!");
      res.json({ message: "Product deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getSalesAnalytics(req, res) {
    try {
      const analytics = await ProductService.getSalesAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getProfitMargin(req, res) {
    try {
      const profit = await ProductService.getProfitMargin();
      res.json(profit);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getTopSellingProducts(req, res) {
    try {
      const products = await ProductService.getTopSellingProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getDeadStock(req, res) {
    try {
      const products = await ProductService.getDeadStock();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = ProductController;
