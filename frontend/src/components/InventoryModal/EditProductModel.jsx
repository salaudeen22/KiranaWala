import React, { useState } from "react";

const EditProductModel = ({ product, setIsEditModalOpen, handleUpdateProduct }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setUpdatedProduct({
      ...updatedProduct,
      images: [{ url: e.target.value }],
    });
  };

  const updateProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:6565/api/vendor/products/update-product/${updatedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        alert("Product updated successfully!");
        handleUpdateProduct();
        setIsEditModalOpen(false);
      } else {
        alert("Error updating product.");
      }
    } catch (error) {
      console.error("Error while updating product:", error);
      alert("Error while updating product.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:6565/api/vendor/products/${product.productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        alert("Deleted Successfully");
        handleUpdateProduct();
        setIsEditModalOpen(false);
      } else {
        alert("Error deleting product.");
      }
    } catch (error) {
      console.error("Error while deleting product:", error);
      alert("Error while deleting product.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct();
  };

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-40 backdrop-blur-md flex justify-center items-center">
      <div className="bg-[#FEFBEF] p-6 rounded-lg shadow-lg w-[400px] relative">
        <h2 className="text-[#E54D43] text-xl font-semibold mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="name">Product Name</label>
          <input id="name" type="text" name="name" value={updatedProduct.name} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Product Name" required />
          
          <label htmlFor="price">Price</label>
          <input id="price" type="number" name="price" value={updatedProduct.price} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Price" required />
          
          <label htmlFor="discount">Discount (%)</label>
          <input id="discount" type="number" name="discount" value={updatedProduct.discount} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Discount (%)" />
          
          <label htmlFor="stock">Stock</label>
          <input id="stock" type="number" name="stock" value={updatedProduct.stock} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Stock" required />
          
          <label htmlFor="category">Category</label>
          <input id="category" type="text" name="category" value={updatedProduct.category} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Category" />
          
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={updatedProduct.description} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Description" />
          
          <label htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" type="text" name="imageUrl" value={updatedProduct.images?.[0]?.url || ""} onChange={handleImageChange} className="w-full p-2 border rounded-lg" placeholder="Image URL" />
          {updatedProduct.images?.[0]?.url && (
            <img src={updatedProduct.images[0].url} alt="Product Preview" className="mt-2 w-10 h-10 object-cover rounded-lg border" onError={(e) => (e.target.style.display = "none")} />
          )}
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
            <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            <button type="submit" className="px-4 py-2 bg-[#E54D43] text-white rounded-lg hover:bg-[#D9B13B]">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModel;