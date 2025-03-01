import AddProductModel from "../components/InventoryModal/addProductModel";
import { useState, useEffect } from "react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    name: "",
    category: "Grocery",
    price: "",
    discount: "",
    stock: "",
    expiryDate: "",
    images: [{ url: "" }],
    ratings: { averageRating: 0 },
  });

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:6565/api/vendor/products/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };
  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch("http://localhost:6565/api/vendor/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
  
      if (response.ok) {
        alert("Added successfully");
        fetchData();
      } else {
        const errorData = await response.json();
        console.log(errorData);
        alert("Failed to add product: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.log(error);
      alert("Error while adding product");
    }
  };
  

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-4 flex space-x-4">
     

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-purple-600 transition"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="table-auto w-full border-collapse text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 border border-gray-300 text-left">Product ID</th>
              <th className="px-4 py-3 border border-gray-300 text-left">Name</th>
              <th className="px-4 py-3 border border-gray-300 text-left">Category</th>
              <th className="px-4 py-3 border border-gray-300 text-left">Price</th>
              <th className="px-4 py-3 border border-gray-300 text-left">Discount</th>
              <th className="px-4 py-3 border border-gray-300 text-left">Stock</th>
              <th className="px-4 py-3 border border-gray-300 text-left">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-100 transition">
                <td className="px-4 py-3 border border-gray-300">{product.productId}</td>
                <td className="px-4 py-3 border border-gray-300">{product.name}</td>
                <td className="px-4 py-3 border border-gray-300">{product.category}</td>
                <td className="px-4 py-3 border border-gray-300">${product.finalPrice}</td>
                <td className="px-4 py-3 border border-gray-300">{product.discount}%</td>
                <td className="px-4 py-3 border border-gray-300">{product.stock}</td>
                <td className="px-4 py-3 border border-gray-300">{product.ratings.averageRating}</td>
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
    </div>
  );
};

export default Inventory;
