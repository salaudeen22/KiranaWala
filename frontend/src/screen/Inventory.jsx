import EditProductModel from "../components/InventoryModal/EditProductModel";
import AddProductModel from "../components/InventoryModal/addProductModel";
import { useState, useEffect } from "react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    name: "",
    category: "Grocery",
    price: "",
    discount: "",
    stock: "",
    expiryDate: "",
    images: [],
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:6565/api/vendor/products/inventory",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setProducts(json);
      }
    } catch (error) {
      console.log(error);
      alert("Error while fetching data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch(
        "http://localhost:6565/api/vendor/products/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      if (response.ok) {
        alert("Added successfully");
        fetchData();
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(
          "Failed to add product: " + (errorData.message || "Unknown error")
        );
      }
    } catch (error) {
      console.log(error);
      alert("Error while adding product");
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="bg-[#FEFBEF] min-h-screen text-[#0E0E0E]">
      {/* Add Product Button */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-[#E54D43] text-white rounded-lg hover:bg-[#D9B13B] transition"
        >
          Add Product
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="table-auto w-full border-collapse text-[#0E0E0E]">
          <thead className="bg-[#D9B13B] text-white">
            <tr>
              <th className="px-4 py-3 border border-gray-300 text-left">
                Product ID
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left">
                Name
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left">
                Category
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left">
                Price
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left">
                Discount
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left">
                Stock
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left">
                Average Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.productId}
                onClick={() => handleEditProduct(product)}
                className="hover:bg-[#F0CF54] transition cursor-pointer"
              >
                <td className="px-4 py-3 border border-gray-300">
                  {product.productId}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {product.name}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {product.category}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  ₹{product.finalPrice}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {product.discount}%
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {product.stock}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {product.ratings.averageRating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddProductModel
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddProduct={handleAddProduct}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {isEditModalOpen && selectedProduct && (
        <EditProductModel
          product={selectedProduct}
          setIsEditModalOpen={setIsEditModalOpen}
          handleUpdateProduct={fetchData}
        />
      )}
    </div>
  );
};

export default Inventory;
