const AddProductModel = ({
  newProduct,
  setNewProduct,
  handleAddProduct,
  setIsModalOpen,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate retailerId
    const retailerId = Number(localStorage.getItem("retailId"));
    if (isNaN(retailerId)) {
      console.error("Invalid retailerId in localStorage");
      return;
    }

    // Update product state with validated retailerId
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      retailerId: retailerId, // Ensure retailerId is valid
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate discount value
    if (newProduct.discount > 100) {
      alert("Discount cannot be greater than 100%");
      return;
    }

    handleAddProduct(newProduct);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:6565/api/upload", {
      method: "POST",
      body: formData,
    });
    console.log("Added Succesfully");

    const data = await response.json();
    if (data.imageUrl) {
      setNewProduct((prev) => ({ ...prev, images: data.imageUrl }));
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-40 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="productId" className="block text-gray-700">
              Product ID
            </label>
            <input
              type="text"
              id="productId"
              name="productId"
              value={newProduct.productId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="Grocery">Grocery</option>
              <option value="Dairy">Dairy</option>
              <option value="Snacks">Snacks</option>
              <option value="Personal Care">Personal Care</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="discount" className="block text-gray-700">
              Discount
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={newProduct.discount}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="stock" className="block text-gray-700">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expiryDate" className="block text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={newProduct.expiryDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="images" className="block text-gray-700">
              Product Image URL
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModel;
