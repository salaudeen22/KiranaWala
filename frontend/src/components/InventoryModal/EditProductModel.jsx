import React, { useState } from "react";
import { 
  FiX, FiEdit2, FiTrash2, FiImage, 
  FiTag, FiDollarSign, FiPercent, 
  FiPackage, FiAlignLeft, FiUpload 
} from "react-icons/fi";

const EditProductModel = ({ product, setIsEditModalOpen, handleUpdateProduct }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ 
    ...product,
    images: product.images || [{ url: "" }] // Ensure images array exists
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:6565/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      if (data.imageUrl) {
        setUpdatedProduct({
          ...updatedProduct,
          images: [{ url: data.imageUrl, altText: `Image of ${updatedProduct.name}` }]
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Image upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProduct = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare final product data
      const productToUpdate = {
        ...updatedProduct,
        price: Number(updatedProduct.price),
        discount: Number(updatedProduct.discount) || 0,
        stock: Number(updatedProduct.stock),
        finalPrice: Number(updatedProduct.price) * (1 - (Number(updatedProduct.discount) / 100))
      };

      const response = await fetch(
        `http://localhost:6565/api/products/${updatedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(productToUpdate),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error updating product");
      }

      alert("Product updated successfully!");
      handleUpdateProduct();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error while updating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://localhost:6565/api/products/${updatedProduct._id}`,
        {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error deleting product");
      }

      alert("Product deleted successfully");
      handleUpdateProduct();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error while deleting product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.stock) {
      setError("Please fill all required fields");
      return;
    }

    if (updatedProduct.discount > 100) {
      setError("Discount cannot be greater than 100%");
      return;
    }

    updateProduct();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FiEdit2 className="text-indigo-600 mr-2" size={20} />
            <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          </div>
          <button
            onClick={() => !isSubmitting && setIsEditModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Product Name */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={updatedProduct.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Product Name"
                  required
                  disabled={isSubmitting}
                />
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Price and Discount */}
            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="relative">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={updatedProduct.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    required
                    disabled={isSubmitting}
                  />
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Discount */}
              <div className="relative">
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    id="discount"
                    type="number"
                    name="discount"
                    value={updatedProduct.discount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Discount"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                  />
                  <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Stock and Category */}
            <div className="grid grid-cols-2 gap-4">
              {/* Stock */}
              <div className="relative">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    value={updatedProduct.stock}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Stock"
                    min="0"
                    required
                    disabled={isSubmitting}
                  />
                  <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={updatedProduct.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={isSubmitting}
                >
                  <option value="Grocery">Grocery</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Personal Care">Personal Care</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="relative">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={updatedProduct.description}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Product description"
                  rows="3"
                  disabled={isSubmitting}
                />
                <FiAlignLeft className="absolute left-3 top-4 text-gray-400" />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {updatedProduct.images?.[0]?.url ? 'Change image' : 'Upload image'}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                </div>
                {updatedProduct.images?.[0]?.url && (
                  <div className="flex-shrink-0">
                    <img 
                      src={updatedProduct.images[0].url} 
                      alt={updatedProduct.images[0].altText || "Product image"} 
                      className="w-20 h-20 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100';
                        e.target.className = 'w-20 h-20 object-cover rounded-lg border bg-gray-100';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => !isSubmitting && setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiEdit2 className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModel;