import React, { useState } from "react";
import { AiOutlinePlusCircle, AiOutlineDelete, AiOutlinePrinter } from "react-icons/ai";
import { FiSearch, FiPlus, FiMinus } from "react-icons/fi";
import Swal from "sweetalert2";

const Sales = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ 
    barcode: "", 
    name: "", 
    id: "", 
    price: "",
    quantity: 1
  });
  const [searchTerm, setSearchTerm] = useState("");

  const addItem = () => {
    if (!newItem.barcode && !newItem.name && !newItem.id) return;
    setItems([...items, { ...newItem }]);
    setNewItem({ barcode: "", name: "", id: "", price: "", quantity: 1 });
  };

  const handleRemoveItem = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This item will be removed from the cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setItems((prevItems) => prevItems.filter((_, i) => i !== index));
        Swal.fire("Removed!", "The item has been removed.", "success");
      }
    });
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = [...items];
    updatedItems[index].quantity = newQuantity;
    setItems(updatedItems);
    Swal.fire({
      icon: 'success',
      title: 'Quantity Updated',
      text: `The quantity has been updated to ${newQuantity}.`,
    });
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.barcode.includes(searchTerm) ||
    item.id.includes(searchTerm)
  );

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl shadow-md text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl font-bold">Din Mart</h1>
            <p className="text-sm opacity-90">5, Babu Reddy Complex, Begur Main Road, Bengaluru</p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div>
                <span className="text-sm font-medium">Invoice: </span>
                <span className="text-sm">#1234</span>
              </div>
              <div>
                <span className="text-sm font-medium">Date: </span>
                <span className="text-sm">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Input Section */}
      <div className="mt-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Add Item Form */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Add New Item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
              <input
                id="barcode"
                type="text"
                placeholder="Scan barcode"
                value={newItem.barcode}
                onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="relative">
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">Search Code</label>
              <input
                id="id"
                type="text"
                placeholder="Enter code"
                value={newItem.id}
                onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="relative">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                id="price"
                type="number"
                placeholder="Enter price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <button
            onClick={addItem}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <AiOutlinePlusCircle className="text-lg" />
            Add Item
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Billing Items ({items.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (₹)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.barcode || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                          className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                        >
                          <FiMinus className="text-gray-600" />
                        </button>
                        <span className="w-8 text-center">{item.quantity || 1}</span>
                        <button 
                          onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                          className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                        >
                          <FiPlus className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <AiOutlineDelete className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    {items.length === 0 ? "No items added yet" : "No matching items found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            <p className="text-sm text-gray-600">Total Items: {items.length}</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-sm font-medium text-gray-600">Subtotal: ₹{totalAmount.toFixed(2)}</p>
            <p className="text-sm font-medium text-gray-600">Tax (5%): ₹{(totalAmount * 0.05).toFixed(2)}</p>
            <p className="text-lg font-bold text-gray-900">Total: ₹{(totalAmount * 1.05).toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white flex items-center justify-center gap-2 transition-colors">
            <AiOutlinePrinter />
            Print Bill
          </button>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors">
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;