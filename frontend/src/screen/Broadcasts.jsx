import { useState, useEffect } from "react";
import {
  FiRefreshCw,
  FiBell,
  FiX,
  FiCheck,
  FiTruck,
  FiPackage,
} from "react-icons/fi";
import { io } from "socket.io-client";

const Broadcasts = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);

  // Fetch broadcasts from API
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
      console.log(data);
      setBroadcasts(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update broadcast status
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
      fetchBroadcasts(); // Refresh the list
      return data.data;
    } catch (err) {
      alert(err.message);
      throw err;
    }
  };

  // Handle accepting a broadcast
  const handleAcceptBroadcast = async (broadcastId) => {
    try {
      const updatedBroadcast = await updateBroadcastStatus(
        broadcastId,
        "accepted"
      );
      setSelectedBroadcast(updatedBroadcast);
    } catch (error) {
      console.error("Error accepting broadcast:", error);
    }
  };

  // Initialize Socket.IO and fetch initial data

  useEffect(() => {
    const socket = io("http://localhost:6565");
    // console.log(socket);

    const retailerId = localStorage.getItem("Id");

    if (retailerId) {
      socket.emit("join_retailer", retailerId);
      console.log(`Retailer ${retailerId} joined`);
    }

    socket.on("new_order", (newOrder) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `New order in ${newOrder.deliveryAddress.city}`,
          broadcast: {
            _id: newOrder.broadcastId, // Use broadcastId as _id for matching
            deliveryAddress: newOrder.deliveryAddress,
            createdAt: newOrder.createdAt,
            // Include other necessary fields if available
          },
          read: false,
          type: "new_order",
        },
        ...prev,
      ]);

      for (let i = 0; i < 5; i++) {
        const audio = new Audio(
          "../../assessts/mixkit-software-interface-remove-2576.wav"
        );
        audio.play().catch((e) => console.log("Audio play failed:", e));
      }

      fetchBroadcasts();
    });

    // Fetch initial data
    fetchBroadcasts();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filter broadcasts based on status
  const filteredBroadcasts = broadcasts.filter((broadcast) => {
    if (!broadcast.status) return false;

    const status = broadcast.status.toLowerCase();

    if (filter === "pending") {
      return status === "pending";
    } else if (filter === "processing") {
      return ["accepted", "preparing", "in_transit"].includes(status);
    } else if (filter === "completed") {
      return ["delivered", "cancelled"].includes(status);
    }
    return true;
  });

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Find by broadcastId which was set as _id in the notification
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
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert"
      >
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
  // console.log("All broadcasts:", broadcasts);
  // console.log("Filter:", filter);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Broadcasts</h1>
        <div className="flex space-x-4 items-center">
          {/* Notification Bell */}
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

          {/* Filter buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 text-sm rounded-lg ${
                filter === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("processing")}
              className={`px-3 py-1 text-sm rounded-lg ${
                filter === "processing"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 text-sm rounded-lg ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Completed
            </button>
          </div>

          <button
            onClick={fetchBroadcasts}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <FiRefreshCw className="mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcasts list */}
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
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No broadcasts found
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
                                : broadcast.status === "accepted" ||
                                  broadcast.status === "preparing"
                                ? "bg-blue-100 text-blue-800"
                                : broadcast.status === "in_transit"
                                ? "bg-purple-100 text-purple-800"
                                : broadcast.status === "delivered"
                                ? "bg-green-100 text-green-800"
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
                            <div className="flex items-center justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptBroadcast(broadcast._id);
                                }}
                                className="text-green-600 hover:text-green-900 mr-2"
                              >
                                <FiCheck className="inline" />
                              </button>
                              <button
                                className="text-red-600"
                                onClick={(e) => {
                                  updateBroadcastStatus(
                                    broadcast._id,
                                    "rejected"
                                  );
                                }}
                              >
                                <FiX />
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
                              className="text-blue-600 hover:text-blue-900 mr-2"
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
                                  "in_transit"
                                );
                              }}
                              className="text-purple-600 hover:text-purple-900"
                              title="Mark as In Transit"
                            >
                              <FiTruck className="inline" />
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

        {/* Broadcast details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-4">
            {selectedBroadcast ? (
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">
                  Order #{selectedBroadcast._id.substring(18, 24)}
                </h2>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <p
                    className={`text-sm font-medium ${
                      selectedBroadcast.status === "pending"
                        ? "text-yellow-600"
                        : selectedBroadcast.status === "accepted" ||
                          selectedBroadcast.status === "preparing"
                        ? "text-blue-600"
                        : selectedBroadcast.status === "in_transit"
                        ? "text-purple-600"
                        : selectedBroadcast.status === "completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedBroadcast.status
                      .split("_")
                      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                      .join(" ")}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Customer
                  </h3>
                  <p className="text-sm">
                    {selectedBroadcast.customerId?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedBroadcast.customerId?.phone || "No contact"}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Delivery Address
                  </h3>
                  <p className="text-sm">
                    {selectedBroadcast.deliveryAddress.street}
                  </p>
                  <p className="text-sm">
                    {selectedBroadcast.deliveryAddress.city},{" "}
                    {selectedBroadcast.deliveryAddress.state} -{" "}
                    {selectedBroadcast.deliveryAddress.pincode}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Contact: {selectedBroadcast.deliveryAddress.contactNumber}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Items
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {selectedBroadcast.products.map((product) => (
                      <li key={product.productId._id} className="py-2">
                        <div className="flex justify-between">
                          <span className="text-sm">
                            {product.quantity} × {product.productId.name}
                          </span>
                          <span className="text-sm font-medium">
                            ₹
                            {(
                              product.priceAtPurchase * product.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Subtotal:</span>
                    <span>₹{selectedBroadcast.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Delivery:</span>
                    <span>₹20.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Tax (5%):</span>
                    <span>
                      ₹{(selectedBroadcast.totalAmount * 0.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2">
                    <span>Total:</span>
                    <span>₹{selectedBroadcast.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Payment Method
                  </h3>
                  <p className="text-sm capitalize">
                    {selectedBroadcast.paymentMethod}
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
