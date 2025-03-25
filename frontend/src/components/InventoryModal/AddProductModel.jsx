import { FiX, FiUpload, FiDollarSign, FiTag, FiPackage, FiCalendar, FiPercent } from "react-icons/fi";
import { useState } from "react";

const AddProductModel = ({
  setIsModalOpen,

}) => {
  const [newProduct, setNewProduct] = useState({
    productId: "",
    name: "",
    description: "",
    category: "Grocery",
    price: "",
    discount: "0", // Default to 0
    stock: "",
    expiryDate: "",
    images: [],
    retailerId: Number(localStorage.getItem("retailId")) || 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      // Prepare the final product data
      const finalProduct = {
        ...productData,
        price: Number(productData.price),
        discount: Number(productData.discount),
        finalPrice: Number(productData.price) * (1 - (Number(productData.discount) / 100)),
        isAvailable: true,
        ratings: {
          averageRating: 0,
          totalReviews: 0
        }
      };

      const response = await fetch(
        "http://localhost:6565/api/vendor/products/add-product",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalProduct),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      alert(data.message || "Product added successfully!");
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message || "Error while adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newProduct.productId || !newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill all required fields");
      return;
    }

    if (newProduct.discount > 100) {
      alert("Discount cannot be greater than 100%");
      return;
    }

    handleAddProduct(newProduct);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        setNewProduct(prev => ({ 
          ...prev, 
          images: [{
            url: data.imageUrl,
            altText: `Image of ${newProduct.name || 'product'}`
          }] 
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            type="button"
            disabled={isSubmitting}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product ID */}
            <div className="relative">
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                Product ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="productId"
                  name="productId"
                  value={newProduct.productId}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={isSubmitting}
                />
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Product Name */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={isSubmitting}
                />
                <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Description */}
            <div className="relative">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                disabled={isSubmitting}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isSubmitting}
              >
                <option value="Grocery">Grocery</option>
                <option value="Dairy">Dairy</option>
                <option value="Snacks">Snacks</option>
                <option value="Personal Care">Personal Care</option>
              </select>
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
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    type="number"
                    id="discount"
                    name="discount"
                    value={newProduct.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isSubmitting}
                  />
                  <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Stock and Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Stock */}
              <div className="relative">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={isSubmitting}
                  />
                  <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Expiry Date */}
              <div className="relative">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={newProduct.expiryDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isSubmitting}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {newProduct.images?.length ? 'Image uploaded' : 'Click to upload'}
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
              {newProduct.images?.length > 0 && (
                <div className="mt-2 text-xs text-green-600">Image uploaded successfully!</div>
              )}
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModel;