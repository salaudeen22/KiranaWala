const Broadcast = require('../model/broadcastSchema');
const Product = require('../model/productSchema');
const Customer = require('../model/customerSchema');
const Retailer = require('../model/vendorSchema');
const Delivery = require('../model/Delivery');
const mongoose = require('mongoose');
const Order = require('../model/OrderSchema');

// Helper function to get date range
const getDateRange = (timeRange) => {
  const now = new Date();
  let startDate;
  
  switch(timeRange) {
    case '7d':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '30d':
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case '90d':
      startDate = new Date(now.setDate(now.getDate() - 90));
      break;
    case '1y':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30));
  }
  
  return { startDate, endDate: new Date() };
};

// Sales Analytics
exports.getSalesAnalytics = async (timeRange, retailerId) => {
  const { startDate, endDate } = getDateRange(timeRange);
  
  const matchStage = { 
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['completed'] }
  };
  
  if (retailerId) {
    matchStage.retailerId = mongoose.Types.ObjectId(retailerId);
  }
  
  const results = await Broadcast.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$grandTotal' },
        totalBroadcasts: { $sum: 1 },
        averageBroadcastValue: { $avg: '$grandTotal' }
      }
    },
    {
      $project: {
        _id: 0,
        totalSales: 1,
        totalBroadcasts: 1,
        averageBroadcastValue: 1
      }
    }
  ]);
  
  // Time series data
  const timeSeries = await Broadcast.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: { format: timeRange === '1y' ? '%Y-%m' : '%Y-%m-%d', date: '$createdAt' }
        },
        totalSales: { $sum: '$grandTotal' },
        broadcastCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  return {
    summary: results[0] || { totalSales: 0, totalBroadcasts: 0, averageBroadcastValue: 0 },
    timeSeries
  };
};

// Sales by Product
exports.getSalesByProduct = async (timeRange, limit, retailerId) => {
  const { startDate, endDate } = getDateRange(timeRange);
  
  const matchStage = { 
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['completed'] }
  };
  
  if (retailerId) {
    matchStage.retailerId = mongoose.Types.ObjectId(retailerId);
  }
  
  return await Broadcast.aggregate([
    { $match: matchStage },
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.productId',
        totalQuantity: { $sum: '$products.quantity' },
        totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.priceAtPurchase'] } }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        productId: '$_id',
        productName: '$product.name',
        productCategory: '$product.category',
        totalQuantity: 1,
        totalRevenue: 1,
        _id: 0
      }
    }
  ]);
};

// Sales by Category
exports.getSalesByCategory = async (timeRange, retailerId) => {
  const { startDate, endDate } = getDateRange(timeRange);
  
  const matchStage = { 
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['completed'] }
  };
  
  if (retailerId) {
    matchStage.retailerId = mongoose.Types.ObjectId(retailerId);
  }
  
  return await Broadcast.aggregate([
    { $match: matchStage },
    { $unwind: '$products' },
    {
      $lookup: {
        from: 'products',
        localField: 'products.productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.priceAtPurchase'] } },
        productCount: { $sum: 1 }
      }
    },
    { $sort: { totalRevenue: -1 } },
    {
      $project: {
        category: '$_id',
        totalRevenue: 1,
        productCount: 1,
        _id: 0
      }
    }
  ]);
};

// Customer Activity
exports.getCustomerActivity = async (timeRange, retailerId) => {
  const { startDate, endDate } = getDateRange(timeRange);
  
  const matchStage = { 
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['completed'] }
  };
  
  if (retailerId) {
    matchStage.retailerId = mongoose.Types.ObjectId(retailerId);
  }
  
  const results = await Broadcast.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$customerId',
        broadcastCount: { $sum: 1 },
        totalSpent: { $sum: '$grandTotal' },
        firstBroadcastDate: { $min: '$createdAt' },
        lastBroadcastDate: { $max: '$createdAt' }
      }
    },
    { $sort: { totalSpent: -1 } },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: '_id',
        as: 'customer'
      }
    },
    { $unwind: '$customer' },
    {
      $project: {
        customerId: '$_id',
        customerName: '$customer.name',
        customerEmail: '$customer.email',
        broadcastCount: 1,
        totalSpent: 1,
        firstBroadcastDate: 1,
        lastBroadcastDate: 1,
        _id: 0
      }
    }
  ]);
  
  // Calculate metrics
  const metrics = await Broadcast.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalCustomers: { $addToSet: '$customerId' },
        avgBroadcastValue: { $avg: '$grandTotal' },
        avgProductsPerBroadcast: { $avg: { $size: '$products' } }
      }
    },
    {
      $project: {
        _id: 0,
        totalCustomers: { $size: '$totalCustomers' },
        avgBroadcastValue: 1,
        avgProductsPerBroadcast: 1
      }
    }
  ]);
  
  return {
    customers: results,
    metrics: metrics[0] || { 
      totalCustomers: 0, 
      avgBroadcastValue: 0, 
      avgProductsPerBroadcast: 0 
    }
  };
};

// Customer Segments
exports.getCustomerSegments = async (retailerId) => {
  const matchStage = {};
  
  if (retailerId) {
    matchStage.preferredStores = { $elemMatch: { retailerId: mongoose.Types.ObjectId(retailerId) } };
  }
  
  // Segment by broadcast frequency
  const frequencySegments = await Customer.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'broadcasts',
        localField: '_id',
        foreignField: 'customerId',
        as: 'broadcasts'
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        broadcastCount: { $size: '$broadcasts' },
        totalSpent: { $sum: '$broadcasts.grandTotal' }
      }
    },
    {
      $bucket: {
        groupBy: '$broadcastCount',
        boundaries: [0, 1, 3, 5, 10, Infinity],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          customers: { $push: { name: '$name', email: '$email', broadcastCount: '$broadcastCount', totalSpent: '$totalSpent' } },
          avgBroadcasts: { $avg: '$broadcastCount' },
          avgSpending: { $avg: '$totalSpent' }
        }
      }
    }
  ]);
  
  // Segment by spending
  const spendingSegments = await Customer.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'broadcasts',
        localField: '_id',
        foreignField: 'customerId',
        as: 'broadcasts'
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        broadcastCount: { $size: '$broadcasts' },
        totalSpent: { $sum: '$broadcasts.grandTotal' }
      }
    },
    {
      $bucket: {
        groupBy: '$totalSpent',
        boundaries: [0, 500, 1000, 2000, 5000, Infinity],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          customers: { $push: { name: '$name', email: '$email', broadcastCount: '$broadcastCount', totalSpent: '$totalSpent' } },
          avgBroadcasts: { $avg: '$broadcastCount' },
          avgSpending: { $avg: '$totalSpent' }
        }
      }
    }
  ]);
  
  return {
    frequencySegments,
    spendingSegments
  };
};

// Inventory Turnover
exports.getInventoryTurnover = async (timeRange, retailerId) => {
  const { startDate, endDate } = getDateRange(timeRange);
  
  const matchStage = { 
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['completed'] }
  };
  
  if (retailerId) {
    matchStage.retailerId = mongoose.Types.ObjectId(retailerId);
  }
  
  // Get sales data
  const salesData = await Broadcast.aggregate([
    { $match: matchStage },
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.productId',
        quantitySold: { $sum: '$products.quantity' }
      }
    }
  ]);
  
  // Get inventory data
  const inventoryMatch = {};
  if (retailerId) {
    inventoryMatch.retailerId = mongoose.Types.ObjectId(retailerId);
  }
  
  const inventoryData = await Product.aggregate([
    { $match: inventoryMatch },
    {
      $project: {
        name: 1,
        category: 1,
        stock: 1,
        price: 1
      }
    }
  ]);
  
  // Calculate turnover
  const products = inventoryData.map(product => {
    const sales = salesData.find(s => s._id.equals(product._id));
    const quantitySold = sales ? sales.quantitySold : 0;
    const turnover = quantitySold / (product.stock + quantitySold);
    
    return {
      productId: product._id,
      productName: product.name,
      category: product.category,
      stock: product.stock,
      quantitySold,
      turnoverRate: turnover,
      value: product.price * product.stock
    };
  });
  
  // Calculate overall metrics
  const totalInventoryValue = products.reduce((sum, p) => sum + p.value, 0);
  const totalQuantitySold = products.reduce((sum, p) => sum + p.quantitySold, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const overallTurnover = totalQuantitySold / (totalStock + totalQuantitySold);
  
  return {
    products: products.sort((a, b) => b.turnoverRate - a.turnoverRate),
    metrics: {
      totalInventoryValue,
      totalQuantitySold,
      totalStock,
      overallTurnover
    }
  };
};

// Stock Levels
exports.getStockLevels = async (threshold, retailerId) => {
  const matchStage = { stock: { $lte: parseInt(threshold) } };
  
  if (retailerId) {
    matchStage.retailerId = mongoose.Types.ObjectId(retailerId);
  }
  
  const lowStockProducts = await Product.find(matchStage)
    .select('name category stock price')
    .sort({ stock: 1 });
  
  // Calculate metrics
  const totalLowStockItems = lowStockProducts.length;
  const totalValueAtRisk = lowStockProducts.reduce((sum, p) => sum + (p.stock * p.price), 0);
  
  return {
    products: lowStockProducts,
    metrics: {
      threshold,
      totalLowStockItems,
      totalValueAtRisk
    }
  };
};

// Delivery Performance
exports.getDeliveryPerformance = async (timeRange, retailerId) => {
  const { startDate, endDate } = getDateRange(timeRange);
  
  const matchStage = { 
    createdAt: { $gte: startDate, $lte: endDate },
    status: 'completed',
    deliveryPersonId: { $exists: true }
  };
  
  if (retailerId) {
    matchStage.retailerId = mongoose.Types.ObjectId(retailerId);
  }
  
  const results = await Broadcast.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$deliveryPersonId',
        totalDeliveries: { $sum: 1 },
        fastestDelivery: { $min: '$deliveryTime' },
        slowestDelivery: { $max: '$deliveryTime' }
      }
    },
    {
      $lookup: {
        from: 'deliveries',
        localField: '_id',
        foreignField: '_id',
        as: 'deliveryPerson'
      }
    },
    { $unwind: '$deliveryPerson' },
    {
      $project: {
        deliveryPersonId: '$_id',
        deliveryPersonName: '$deliveryPerson.name',
        totalDeliveries: 1,
        fastestDelivery: 1,
        slowestDelivery: 1,
        _id: 0
      }
    },
    { $sort: { totalDeliveries: -1 } }
  ]);
  
  // Calculate overall metrics
  const overallMetrics = await Broadcast.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalDeliveries: { $sum: 1 },
        avgDeliveryTime: { $avg: '$deliveryTime' }
      }
    },
    {
      $project: {
        _id: 0,
        totalDeliveries: 1,
        avgDeliveryTime: 1
      }
    }
  ]);
  
  return {
    deliveryPersons: results,
    overallMetrics: overallMetrics[0] || { 
      totalDeliveries: 0, 
      avgDeliveryTime: 0
    }
  };
};

// Broadcast Analytics
exports.getBroadcastAnalytics = async (timeRange) => {
  const { startDate, endDate } = getDateRange(timeRange);

  const results = await Broadcast.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalBroadcasts = results.reduce((sum, item) => sum + item.count, 0);

  return {
    totalBroadcasts,
    statusBreakdown: results,
  };
};

// Order Analytics
exports.getOrderAnalytics = async (timeRange) => {
  const { startDate, endDate } = getDateRange(timeRange);

  const results = await Broadcast.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate }, orderId: { $exists: true } } },
    {
      $group: {
        _id: "$orderId",
        totalRevenue: { $sum: "$grandTotal" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const totalOrders = results.length;
  const totalRevenue = results.reduce((sum, item) => sum + item.totalRevenue, 0);

  return {
    totalOrders,
    totalRevenue,
    orderDetails: results,
  };
};

// Get top customers by spending
exports.getTopCustomers = async (timeRange, limit, retailerId) => {
  const dateRange = getDateRange(timeRange);
  const matchCriteria = { createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate } };

  if (retailerId) {
    matchCriteria.retailerId = mongoose.Types.ObjectId(retailerId);
  }

  const customers = await Order.aggregate([
    { $match: matchCriteria },
    {
      $group: {
        _id: '$customerId',
        totalSpent: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: '_id',
        as: 'customerDetails',
      },
    },
    { $unwind: '$customerDetails' },
    {
      $project: {
        _id: 1,
        totalSpent: 1,
        orderCount: 1,
        name: '$customerDetails.name',
        email: '$customerDetails.email',
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: parseInt(limit, 10) },
  ]);

  return customers;
};

// Get top categories by revenue
exports.getTopCategories = async (timeRange, limit, retailerId) => {
  const dateRange = getDateRange(timeRange);
  const matchCriteria = { createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate } };

  if (retailerId) {
    matchCriteria.retailerId = mongoose.Types.ObjectId(retailerId);
  }

  const categories = await Product.aggregate([
    { $match: matchCriteria },
    {
      $group: {
        _id: '$category',
        totalRevenue: { $sum: '$price' },
        totalQuantity: { $sum: '$quantitySold' },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: parseInt(limit, 10) },
  ]);

  return categories;
};

// Get customer retention rate
exports.getCustomerRetentionRate = async (timeRange, retailerId) => {
  const dateRange = getDateRange(timeRange);
  const matchCriteria = { createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate } };

  if (retailerId) {
    matchCriteria.retailerId = mongoose.Types.ObjectId(retailerId);
  }

  const totalCustomers = await Customer.countDocuments(matchCriteria);
  const returningCustomers = await Customer.aggregate([
    { $match: matchCriteria },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'customerId',
        as: 'orders',
      },
    },
    { $match: { 'orders.1': { $exists: true } } },
    { $count: 'returningCustomers' },
  ]);

  const retentionRate = (returningCustomers[0]?.returningCustomers || 0) / totalCustomers * 100;

  return { totalCustomers, returningCustomers: returningCustomers[0]?.returningCustomers || 0, retentionRate };
};