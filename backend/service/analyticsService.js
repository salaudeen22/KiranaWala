const Order = require("../model/orderSchema");

exports.getTotalOrders = async () => {
  return await Order.countDocuments();
};

exports.getPendingOrders = async () => {
  return await Order.countDocuments({ status: "pending" });
};

exports.getOrderStatusBreakdown = async () => {
  const breakdown = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  return breakdown;
};

exports.getTotalRevenue = async () => {
  const result = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
  ]);
  return result[0]?.totalRevenue || 0;
};

exports.getTopSellingProducts = async () => {
  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.productId", totalQuantity: { $sum: "$items.quantity" } } },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 }
  ]);
  return topProducts;
};

exports.getOrderTrends = async () => {
  const trends = await Order.aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { "_id": 1 } }
  ]);
  return trends;
};

exports.getPaymentMethodAnalytics = async () => {
  const methods = await Order.aggregate([
    { $group: { _id: "$paymentDetails.method", count: { $sum: 1 } } }
  ]);
  return methods;
};
exports.getMonthlySales = async () => {
  return await Order.aggregate([
    { $match: { status: "delivered" } },
    { 
      $group: { 
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalAmount" }
      } 
    },
    { $sort: { _id: 1 } }
  ]);
};
