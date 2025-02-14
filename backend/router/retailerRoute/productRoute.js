const express = require("express");
const mongoose = require("mongoose");
const Product = require("../../model/productSchema");

const router = express.Router();

const vendorSchema = require("../../model/vendorSchema");

//  Add a new product
router.post("/", async (req, res) => {
  try {
    let { retailerId, ...productData } = req.body;

    retailerId = Number(retailerId);
    const product = new Product({ ...productData, retailerId });
    await product.save();

    await vendorSchema.findOneAndUpdate(
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

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Get a product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Update a product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      productId: req.params.id,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    await vendorSchema.findOneAndUpdate(
      { retailerId: product.retailerId },
      {
        $pull: {
          inventory: { productId: product.productId },
        },
      },
      { new: true }
    );
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Get low stock products (e.g., stock < 10)
router.get("/low-stock", async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 10 } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Get available products
router.get("/available", async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
