const mongoose = require("mongoose");

const ProductCatalogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      enum: [
        "Grocery",
        "Dairy",
        "Snacks",
        "Beverages",
        "Personal Care",
        "Household",
        "Other",
      ],
    },
    barcode: { type: String, unique: true, sparse: true, index: true },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String },
      },
    ],
    tags: [String],
    variants: [
      {
        type: { type: String },
        value: { type: String },
      },
    ],
    taxRate: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductCatalog", ProductCatalogSchema);
