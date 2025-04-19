import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart, useDispatchCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { io } from "socket.io-client";

function CartPage() {
  const cart = useCart();
  const dispatch = useDispatchCart();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    contactNumber: '',
    isDefault: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  useEffect(() => {
    const socket = io("http://localhost:6565", {
      transports: ["websocket", "polling"], // Ensure proper transport methods
    });

    if (user) {
      socket.emit("join_customer", user.id); // Join the customer room

      socket.on("broadcast_accepted", (data) => {
        console.log("Notification received:", data); // Debugging log
        alert(
          `Your order has been accepted by retailer ${data.retailer.name}. Address: ${data.retailer.address}`
        );
      });
    }

    return () => {
      socket.disconnect(); // Clean up the socket connection
    };
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('http://localhost:6565/api/customers/Alladdress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
  
      if (response.ok) {
        setAddresses(data.data);
        // Set default address if available
        const defaultAddress = data.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch addresses');
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const handleQuantityChange = (id, change) => {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    const newQty = item.qty + change;
    
    if (newQty < 1) {
      dispatch({ type: "REMOVE", id });
    } else {
      const newPrice = (item.price / item.qty) * newQty;
      dispatch({ 
        type: "UPDATE", 
        id, 
        qty: newQty, 
        price: newPrice 
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const saveNewAddress = async () => {
    try {
      const response = await fetch('http://localhost:6565/api/customers/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(newAddress)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save address');
      }

      // Refresh addresses and select the newly added one
      await fetchAddresses();
      setShowAddressForm(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        contactNumber: '',
        isDefault: false
      });
    } catch (err) {
      console.error("Error saving address:", err);
      alert(err.message);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select or add a delivery address.");
      return;
    }

    try {
      const orderPayload = {
        customerId: user.id,
        retailerId: "67f0e6ae966a110b2d0fea79",
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.qty,
          price: item.price / item.qty,
          discount: 0,
          finalPrice: item.price,
          image: item.img || ""
        })),
        deliveryAddress: selectedAddress,
        paymentMethod: "COD",
        subtotal: totalPrice,
        tax: 0,
        deliveryFee: 10,
        total: totalPrice + 10
      };

      const broadcastPayload = {
        products: cart.map(item => ({
          productId: item.id,
          quantity: item.qty
        })),
        coordinates: [77.5946, 12.9716],
        paymentMethod: "UPI",
        deliveryAddress: selectedAddress
      };

      // Place order
      await axios.post("http://localhost:6565/api/customers/orders", orderPayload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // Broadcast order
      await axios.post("http://localhost:6565/api/broadcasts", broadcastPayload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FiShoppingCart className="mr-2" /> Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            to="/" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {cart.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`} 
                  className="border-b last:border-b-0 p-4 flex"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded mr-4 overflow-hidden">
                    {item.img && (
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-green-600 font-bold mt-1">
                      ₹{(item.price / item.qty).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center mt-3">
                      <button 
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="p-1 border rounded-l hover:bg-gray-100"
                      >
                        <FiMinus size={14} />
                      </button>
                      
                      <span className="px-3 py-1 border-t border-b">
                        {item.qty}
                      </span>
                      
                      <button 
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="p-1 border rounded-r hover:bg-gray-100"
                      >
                        <FiPlus size={14} />
                      </button>
                      
                      <button 
                        onClick={() => dispatch({ type: "REMOVE", id: item.id })}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="border-t my-4"></div>
              
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Delivery Address</h3>
                {selectedAddress ? (
                  <div className="border p-3 rounded-lg mb-2">
                    <p className="font-medium">{selectedAddress.street}</p>
                    <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                    <p>Contact: {selectedAddress.contactNumber}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No address selected</p>
                )}
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full text-blue-600 hover:underline text-sm"
                >
                  {selectedAddress ? 'Change Address' : 'Select Address'}
                </button>
              </div>
              
              <button 
                onClick={handleCheckout} 
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
                disabled={!selectedAddress}
              >
                Proceed to Checkout
              </button>
              
              <Link 
                to="/" 
                className="block text-center mt-4 text-green-600 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Select Delivery Address</h2>
            
            {!showAddressForm ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {addresses.map(address => (
                    <div 
                      key={address._id} 
                      className={`border rounded-lg p-4 cursor-pointer ${selectedAddress?._id === address._id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowModal(false);
                      }}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                              Default
                            </span>
                          )}
                          {address.street.substring(0, 30)}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      {address.contactNumber && (
                        <p className="text-gray-600 text-sm mt-1">Contact: {address.contactNumber}</p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200"
                >
                  + Add New Address
                </button>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-3">Add New Address</h3>
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        placeholder="House No., Building, Street"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        name="landmark"
                        placeholder="Nearby landmark"
                        value={newAddress.landmark}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                      <input
                        type="text"
                        name="contactNumber"
                        placeholder="Phone number"
                        value={newAddress.contactNumber}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="col-span-2 flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={handleAddressChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveNewAddress}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;