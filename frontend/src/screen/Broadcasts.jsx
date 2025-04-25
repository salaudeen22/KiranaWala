import { useState, useEffect, useRef } from "react";
import {
  FiRefreshCw,
  FiBell,
  FiX,
  FiCheck,
  FiTruck,
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiCheckCircle,
} from "react-icons/fi";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import notificationSound from "../assets/note.mp3";

const Broadcasts = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.load();

    const handleUserInteraction = () => {
      audioRef.current.play().catch(() => {
        console.log("Audio preloaded after user interaction.");
      });
      window.removeEventListener("click", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:6565/api/broadcasts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch broadcasts");

      const data = await response.json();
      setBroadcasts(data.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Broadcasts",
        text: err.message || "Unable to fetch broadcasts. Please try again later.",
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBroadcastStatus = async (broadcastId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:6565/api/broadcasts/${broadcastId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update broadcast status");

      const data = await response.json();
      fetchBroadcasts();
      return data.data;
    } catch (err) {
      Swal.fire("Error", err.message, "error");
      throw err;
    }
  };

  const handleAcceptBroadcast = async (broadcastId) => {
    try {
      const updatedBroadcast = await updateBroadcastStatus(
        broadcastId,
        "accepted"
      );

      const socket = io("http://localhost:6565");
      socket.emit("broadcast_accepted", {
        broadcastId: updatedBroadcast._id,
        retailer: {
          id: localStorage.getItem("Id"),
          name: "Retailer Name",
          address: "Retailer Address",
        },
      });

      const detailsResponse = await fetch(
        `http://localhost:6565/api/broadcasts/${broadcastId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        setSelectedBroadcast(detailsData.data);
      } else {
        setSelectedBroadcast(updatedBroadcast);
      }
    } catch (error) {
      console.error("Error accepting broadcast:", error);
    }
  };

  const handleCompleteBroadcast = async (broadcastId) => {
    try {
      const response = await fetch(
        `http://localhost:6565/api/broadcasts/${broadcastId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update broadcast status");

      const detailsResponse = await fetch(
        `http://localhost:6565/api/broadcasts/${broadcastId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        setSelectedBroadcast(detailsData.data);
        Swal.fire({
          icon: "success",
          title: "Order Completed!",
          text: "The order has been marked as completed successfully.",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        const updatedBroadcast = await response.json();
        setSelectedBroadcast(updatedBroadcast.data);
      }
      
      fetchBroadcasts();
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to complete order", "error");
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:6565");
    const retailerId = localStorage.getItem("Id");

    if (retailerId) {
      socket.emit("join_retailer", retailerId);
    }

    socket.on("new_order", (newOrder) => {
      try {
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
      } catch (e) {
        console.log("Audio error:", e);
      }

      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `New order in ${newOrder.deliveryAddress.city}`,
          broadcast: {
            _id: newOrder.broadcastId,
            deliveryAddress: newOrder.deliveryAddress,
            createdAt: newOrder.createdAt,
          },
          read: false,
          type: "new_order",
        },
        ...prev,
      ]);

      fetchBroadcasts();
    });

    fetchBroadcasts();

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredBroadcasts = broadcasts.filter((broadcast) => {
    if (!broadcast.status) return false;

    const status = broadcast.status.toLowerCase();

    if (filter === "pending") {
      return status === "pending";
    } else if (filter === "processing") {
      return ["accepted", "preparing", "shipped"].includes(status);
    } else if (filter === "expired") {
      return status === "expired";
    } else if (filter === "rejected") {
      return status === "rejected";
    } else if (filter === "completed") {
      return ["completed", "delivered"].includes(status);
    }
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    const matchingBroadcast = broadcasts.find(
      (b) => b._id === notification.broadcast._id
    );
    if (matchingBroadcast) {
      setSelectedBroadcast(matchingBroadcast);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={fetchBroadcasts}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Broadcasts</h1>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-200 relative"
            >
              <FiBell className="text-xl" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10">
                <div className="p-2 border-b flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800"
                      title="Mark all as read"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-red-600 hover:text-red-800"
                      title="Clear all"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start">
                          {notification.type === "new_order" && (
                            <FiPackage className="mt-1 mr-2 text-green-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                notification.broadcast.createdAt
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("processing")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === "processing"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Completed
            </button>
          </div>

          <button
            onClick={fetchBroadcasts}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
          >
            <FiRefreshCw className="mr-1" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBroadcasts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredBroadcasts.map((broadcast) => (
                      <tr
                        key={broadcast._id}
                        className={`hover:bg-gray-50 ${
                          selectedBroadcast?._id === broadcast._id
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() => setSelectedBroadcast(broadcast)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{broadcast._id.substring(18, 24)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(broadcast.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {broadcast.products.length} items
                          </div>
                          <div className="text-xs text-gray-500">
                            ₹{broadcast.totalAmount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              broadcast.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : ["accepted", "preparing"].includes(
                                    broadcast.status
                                  )
                                ? "bg-blue-100 text-blue-800"
                                : broadcast.status === "shipped"
                                ? "bg-purple-100 text-purple-800"
                                : broadcast.status === "delivered" ||
                                  broadcast.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : broadcast.status === "expired"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {broadcast.status
                              .split("_")
                              .map(
                                (s) => s.charAt(0).toUpperCase() + s.slice(1)
                              )
                              .join(" ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {broadcast.status === "pending" && (
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptBroadcast(broadcast._id);
                                }}
                                className="p-1.5 text-green-600 hover:text-green-800 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                                title="Accept Order"
                              >
                                <FiCheck className="inline" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateBroadcastStatus(
                                    broadcast._id,
                                    "rejected"
                                  );
                                }}
                                className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                                title="Reject Order"
                              >
                                <FiX className="inline" />
                              </button>
                            </div>
                          )}
                          {broadcast.status === "accepted" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateBroadcastStatus(
                                  broadcast._id,
                                  "preparing"
                                );
                              }}
                              className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                              title="Mark as Preparing"
                            >
                              <FiPackage className="inline" />
                            </button>
                          )}
                          {["accepted", "preparing"].includes(
                            broadcast.status
                          ) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateBroadcastStatus(
                                  broadcast._id,
                                  "shipped"
                                );
                              }}
                              className="p-1.5 text-purple-600 hover:text-purple-800 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
                              title="Mark as Shipped"
                            >
                              <FiTruck className="inline" />
                            </button>
                          )}
                          {["shipped", "preparing", "accepted"].includes(
                            broadcast.status
                          ) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteBroadcast(broadcast._id);
                              }}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                              title="Mark as Completed"
                            >
                              <FiCheckCircle className="mr-1" />
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-4">
            {selectedBroadcast ? (
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FiShoppingBag className="mr-2" />
                  Order #{selectedBroadcast._id.substring(18, 24)}
                  <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                    selectedBroadcast.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {selectedBroadcast.status.charAt(0).toUpperCase() + selectedBroadcast.status.slice(1)}
                  </span>
                </h2>

                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiUser className="mr-1" />
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium">
                        {selectedBroadcast.customerId?.name || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="text-sm">
                        {selectedBroadcast.customerId?.phone || selectedBroadcast.deliveryAddress?.contactNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiMapPin className="mr-1" />
                    Delivery Address
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm">{selectedBroadcast.deliveryAddress?.street}</p>
                    <p className="text-sm">
                      {selectedBroadcast.deliveryAddress?.city}, {selectedBroadcast.deliveryAddress?.state} -{" "}
                      {selectedBroadcast.deliveryAddress?.pincode}
                    </p>
                    {selectedBroadcast.deliveryAddress?.landmark && (
                      <p className="text-sm">Landmark: {selectedBroadcast.deliveryAddress.landmark}</p>
                    )}
                    {selectedBroadcast.deliveryAddress?.instructions && (
                      <p className="text-sm text-blue-600">
                        Instructions: {selectedBroadcast.deliveryAddress.instructions}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Order Items ({selectedBroadcast.products.length})
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {selectedBroadcast.products.map((product) => (
                      <li key={product.productId._id} className="py-2">
                        <div className="flex justify-between">
                          <span className="text-sm">
                            {product.quantity} × {product.productId.name}
                          </span>
                          <span className="text-sm font-medium">
                            ₹{(product.priceAtPurchase * product.quantity).toFixed(2)}
                          </span>
                        </div>
                        {product.notes && (
                          <p className="text-xs text-gray-500 mt-1">
                            Note: {product.notes}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiCreditCard className="mr-1" />
                    Payment Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{selectedBroadcast.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee:</span>
                      <span>₹20.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (5%):</span>
                      <span>₹{(selectedBroadcast.totalAmount * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>₹{selectedBroadcast.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Payment Method
                  </h3>
                  <p className="text-sm capitalize">
                    {selectedBroadcast.paymentMethod}
                    {selectedBroadcast.paymentMethod === "online" && selectedBroadcast.paymentStatus === "paid" && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        Paid
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FiPackage className="mx-auto h-12 w-12" />
                <p className="mt-2">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcasts;