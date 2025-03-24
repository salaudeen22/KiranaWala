const Order = require("../model/orderSchema");

exports.createOrder = async (orderData) => {
  return await Order.create(orderData);
};

exports.getAllOrders = async () => {
  return await Order.find().populate("customerId storeId items.productId");
};

exports.getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate("customerId storeId items.productId");
};

exports.updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};

exports.deleteOrder = async (orderId) => {
  return await Order.findByIdAndDelete(orderId);
};
