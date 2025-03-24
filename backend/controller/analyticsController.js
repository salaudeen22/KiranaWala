const analyticsService = require("../service/analyticsService");

exports.getTotalOrders = async (req, res) => {
  try {
    const count = await analyticsService.getTotalOrders();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingOrders = async (req, res) => {
  try {
    const count = await analyticsService.getPendingOrders();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderStatusBreakdown = async (req, res) => {
  try {
    const breakdown = await analyticsService.getOrderStatusBreakdown();
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await analyticsService.getTotalRevenue();
    res.json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await analyticsService.getTopSellingProducts();
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderTrends = async (req, res) => {
  try {
    const trends = await analyticsService.getOrderTrends();
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentMethodAnalytics = async (req, res) => {
  try {
    const paymentMethods = await analyticsService.getPaymentMethodAnalytics();
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlySales = async () => {
  const sales = await Order.aggregate([
    {
      $match: { status: "delivered" } 
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by year-month
        totalSales: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } } // Sort by month
  ]);
  return sales;
};


