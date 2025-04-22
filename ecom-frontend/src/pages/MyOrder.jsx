import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPackage, FiCalendar, FiMapPin, FiCreditCard, FiLoader, FiChevronDown, FiChevronUp } from "react-icons/fi";

// Order Status Badge Component
const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    preparing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

// Order Item Component
const OrderItem = ({ item }) => (
  <div className="flex items-center py-3 border-b border-gray-100 last:border-0">
    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
      {item.image && (
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      )}
    </div>
    <div className="flex-1">
      <h4 className="font-medium">{item.name}</h4>
      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
    </div>
    <div className="text-right">
      <p className="font-medium">₹{item.finalPrice.toFixed(2)}</p>
      {item.discount > 0 && (
        <p className="text-xs text-gray-500 line-through">₹{item.price.toFixed(2)}</p>
      )}
    </div>
  </div>
);

// Order Card Component
const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="flex items-center mb-1">
            <h2 className="font-semibold mr-3">Order #{order.orderId}</h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-600 flex items-center">
            <FiCalendar className="mr-1" /> 
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </p>
        </div>
        <div>
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Order Items */}
          <div className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <FiPackage className="mr-2" /> Items ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <OrderItem key={item._id} item={item} />
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="p-4 bg-gray-50">
            <h3 className="font-semibold mb-2 flex items-center">
              <FiMapPin className="mr-2" /> Delivery Address
            </h3>
            <div className="text-sm text-gray-600">
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
              {order.deliveryAddress.landmark && <p>Landmark: {order.deliveryAddress.landmark}</p>}
              <p>Contact: {order.deliveryAddress.contactNumber}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="font-semibold mb-2 flex items-center">
              <FiCreditCard className="mr-2" /> Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Method</p>
                <p className="capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="capitalize">{order.paymentStatus}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Empty State Component
const EmptyOrders = () => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <FiPackage className="text-gray-400 text-3xl" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
    <p className="text-gray-500 mb-6">Your order history will appear here</p>
    <a
      href="/products"
      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
    >
      Browse Products
    </a>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <FiLoader className="animate-spin text-4xl text-green-600" />
  </div>
);

// Error State Component
const ErrorState = ({ error }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <FiPackage className="text-red-500 text-3xl" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">Something went wrong</h3>
    <p className="text-gray-500 mb-6">{error}</p>
    <button
      onClick={() => window.location.reload()}
      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Main Component
function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:6565/api/customers/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch orders.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            View your order history and track current orders
          </p>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrder;