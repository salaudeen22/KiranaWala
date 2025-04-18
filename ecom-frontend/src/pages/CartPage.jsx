import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart, useDispatchCart } from '../context/CartContext';

function CartPage() {
  const cart = useCart();
  const dispatch = useDispatchCart();

  // Debugging: Log cart data to ensure it's being fetched correctly
  useEffect(() => {
    console.log("Cart data:", cart);
  }, [cart]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

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
              
              <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
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
    </div>
  );
}

export default CartPage;