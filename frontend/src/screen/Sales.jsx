import React, { useState } from "react";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";

const Sales = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ barcode: "", name: "", id: "", price: "" });

  const addItem = () => {
    if (!newItem.barcode && !newItem.name && !newItem.id) return;
    setItems([...items, { ...newItem, quantity: 1 }]);
    setNewItem({ barcode: "", name: "", id: "", price: "" });
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#FEFBEF] text-[#0E0E0E] p-4">
      {/* Header Section */}
      <div className="bg-[#D9B13B] p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between">
        <div>
          <h1 className="text-lg font-bold">Shop Details</h1>
          <p className="text-sm"><b>Vendor:</b> Din Mart</p>
          <p className="text-sm"><b>Address:</b> 5, Babu Reddy Complex, Begur Main Road, Bengaluru</p>
        </div>
        <div className="text-right">
          <p className="text-sm"><b>Invoice:</b> 1234</p>
          <p className="text-sm"><b>Date:</b> 12/2/2025</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="mt-4 bg-white p-4 rounded-xl shadow-lg">
        <h2 className="text-md font-semibold mb-2">Add Item</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Barcode"
            value={newItem.barcode}
            onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-[#E54D43]"
          />
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-[#E54D43]"
          />
          <input
            type="text"
            placeholder="Search Code"
            value={newItem.id}
            onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-[#E54D43]"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-[#E54D43]"
          />
        </div>
        <button
          onClick={addItem}
          className="mt-3 bg-[#F0CF54] text-black px-4 py-2 rounded-lg shadow hover:bg-[#D9B13B] flex items-center gap-2"
        >
          <AiOutlinePlusCircle /> Add Item
        </button>
      </div>

      {/* Item Table */}
      <div className="mt-4 bg-white p-4 rounded-xl shadow-lg">
        <h2 className="text-md font-semibold mb-2">Billing Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#E54D43] text-white">
                <th className="p-2">S.No</th>
                <th className="p-2">Barcode</th>
                <th className="p-2">Item Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.barcode || "N/A"}</td>
                  <td className="p-2">{item.name || "N/A"}</td>
                  <td className="p-2">{item.price || "0"}</td>
                  <td className="p-2">1</td>
                  <td className="p-2">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-[#E54D43] hover:text-red-600"
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="mt-4 bg-[#F0CF54] p-4 rounded-xl shadow-lg">
        <h2 className="text-md font-semibold mb-2">Total Summary</h2>
        <div className="flex justify-between">
          <p><b>Total Items:</b> {items.length}</p>
          <p><b>Total Amount:</b> ₹{items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default Sales;
