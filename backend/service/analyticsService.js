const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");

exports.getOrderAnalytics = async () => {
  const [
    totalOrders,
    pendingOrders,
    statusBreakdown,
    totalRevenue,
    topProducts,
    paymentMethods,
    totalProducts,
    lowStockAlerts,
    outOfStockItems
  ] = await Promise.all([
    Order.countDocuments(), // Total orders
    Order.countDocuments({ status: "pending" }), // Pending orders
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]), // Status breakdown
    Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]).then((res) => res[0]?.totalRevenue || 0), // Total revenue
    Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", totalQuantity: { $sum: "$items.quantity" } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]), // Top 10 products
    Order.aggregate([{ $group: { _id: "$paymentDetails.method", count: { $sum: 1 } } }]), // Payment method breakdown
    Product.countDocuments(), // Total product count
    Product.countDocuments({ stock: { $lt: 5, $gt: 0 } }), // Low stock alerts (less than 5 units)
    Product.countDocuments({ stock: 0 }) // Out-of-stock products
  ]);

  return {
    totalOrders,
    pendingOrders,
    statusBreakdown,
    totalRevenue,
    topProducts,
    paymentMethods,
    totalProducts,
    lowStockAlerts,
    outOfStockItems
  };
};
