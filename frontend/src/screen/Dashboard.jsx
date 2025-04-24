import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { FiArrowUp, FiArrowDown, FiDownload, FiCalendar, FiAlertTriangle, FiStar, FiUsers, FiShoppingBag, FiPieChart } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [broadcastAnalytics, setBroadcastAnalytics] = useState(null);
  const [orderAnalytics, setOrderAnalytics] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [customerRetention, setCustomerRetention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch sales analytics
        const salesResponse = await fetch("http://localhost:6565/api/analytics/sales?timeRange=30d", { headers });
        const salesJson = await salesResponse.json();
        const salesTimeSeries = salesJson.data.timeSeries || [];
        setSalesData({
          labels: salesTimeSeries.map((item) => item._id),
          datasets: [
            {
              label: "Total Sales",
              data: salesTimeSeries.map((item) => item.totalSales),
              borderColor: "#6366F1",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: "#6366F1",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });

        // Fetch revenue channels (sales by category)
        const pieResponse = await fetch("http://localhost:6565/api/analytics/sales-by-category?timeRange=30d", { headers });
        const pieJson = await pieResponse.json();
        const pieCategories = pieJson.data || [];
        setPieData({
          labels: pieCategories.map((item) => item.category),
          datasets: [
            {
              data: pieCategories.map((item) => item.totalRevenue),
              backgroundColor: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#6366F1"],
              borderWidth: 0,
              hoverOffset: 10,
            },
          ],
        });

        // Fetch metrics (summary from sales analytics)
        setMetrics([
          { name: "Revenue", value: `₹${salesJson.data.summary.totalSales.toLocaleString()}`, change: "+5.23%", trend: "up", icon: <FiShoppingBag className="text-indigo-500" /> },
          { name: "Orders", value: salesJson.data.summary.totalBroadcasts, change: "+12.5%", trend: "up", icon: <FiPieChart className="text-green-500" /> },
          { name: "Avg. Order", value: `₹${salesJson.data.summary.averageBroadcastValue.toFixed(2)}`, change: "-2.3%", trend: "down", icon: <FiStar className="text-yellow-500" /> },
          { name: "Customers", value: salesJson.data.summary.totalCustomers || 0, change: "+8.1%", trend: "up", icon: <FiUsers className="text-blue-500" /> },
        ]);

        // Fetch top products
        const productsResponse = await fetch("http://localhost:6565/api/analytics/sales-by-product?timeRange=30d&limit=4", { headers });
        const productsJson = await productsResponse.json();
        setTopProducts(productsJson.data || []);

        // Fetch inventory alerts
        const inventoryResponse = await fetch("http://localhost:6565/api/analytics/stock-levels?threshold=5", { headers });
        const inventoryJson = await inventoryResponse.json();
        setInventoryAlerts(inventoryJson.data.products || []);

        // Fetch broadcast analytics
        const broadcastResponse = await fetch("http://localhost:6565/api/analytics/broadcasts?timeRange=30d", { headers });
        const broadcastJson = await broadcastResponse.json();
        setBroadcastAnalytics(broadcastJson.data);

        // Fetch order analytics
        const orderResponse = await fetch("http://localhost:6565/api/analytics/orders?timeRange=30d", { headers });
        const orderJson = await orderResponse.json();
        setOrderAnalytics(orderJson.data);

        // Fetch top customers
        const customersResponse = await fetch("http://localhost:6565/api/analytics/top-customers?timeRange=30d&limit=5", { headers });
        const customersJson = await customersResponse.json();
        setTopCustomers(customersJson.data || []);

        // Fetch top categories
        const categoriesResponse = await fetch("http://localhost:6565/api/analytics/top-categories?timeRange=30d&limit=5", { headers });
        const categoriesJson = await categoriesResponse.json();
        setTopCategories(categoriesJson.data || []);

        // Fetch customer retention rate
        const retentionResponse = await fetch("http://localhost:6565/api/analytics/customer-retention?timeRange=30d", { headers });
        const retentionJson = await retentionResponse.json();
        setCustomerRetention(retentionJson.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <div className="text-red-500 mb-4">
            <FiAlertTriangle className="inline-block text-3xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{metric.name}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-opacity-20 bg-indigo-100 text-indigo-600">
                {metric.icon}
              </div>
            </div>
            <div className={`mt-2 flex items-center text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {metric.trend === "up" ? (
                <FiArrowUp className="mr-1" />
              ) : (
                <FiArrowDown className="mr-1" />
              )}
              {metric.change}
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Trend */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Sales Performance</h2>
              <p className="text-sm text-gray-500">Revenue trends over the last 30 days</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-md">Daily</button>
              <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-md">Weekly</button>
              <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-md">Monthly</button>
            </div>
          </div>
          <div className="h-72">
            <Line
              data={salesData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                    },
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    backgroundColor: "rgba(0,0,0,0.8)",
                    titleFont: { size: 12 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                      label: function(context) {
                        return ` ₹${context.raw.toLocaleString()}`;
                      }
                    }
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "#6B7280",
                    }
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
                      color: "rgba(0,0,0,0.05)",
                    },
                    ticks: {
                      color: "#6B7280",
                      callback: function (value) {
                        return "₹" + value.toLocaleString();
                      },
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                  },
                  point: {
                    hoverRadius: 8,
                    hoverBorderWidth: 2,
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Sales Distribution */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Channels</h2>
            <p className="text-sm text-gray-500">Sales distribution by category</p>
          </div>
          <div className="h-56 mb-4">
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12
                      }
                    },
                  },
                  tooltip: {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ₹${context.raw.toLocaleString()}`;
                      },
                    },
                  },
                },
                cutout: "65%",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {pieData?.labels.map((label, index) => (
              <div key={index} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: pieData.datasets[0].backgroundColor[index] }}
                ></div>
                <span className="text-gray-600 truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Broadcast Analytics */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Broadcast Analytics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-xs text-indigo-600 font-medium mb-1">Total Broadcasts</p>
              <p className="text-xl font-bold text-gray-800">{broadcastAnalytics?.totalBroadcasts || 0}</p>
            </div>
            {broadcastAnalytics?.statusBreakdown.map((status, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-medium mb-1 capitalize">{status._id}</p>
                <p className="text-xl font-bold text-gray-800">{status.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Analytics */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Analytics</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-green-600 font-medium mb-1">Total Orders</p>
              <p className="text-xl font-bold text-gray-800">{orderAnalytics?.totalOrders || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-xs text-yellow-600 font-medium mb-1">Total Revenue</p>
              <p className="text-xl font-bold text-gray-800">₹{orderAnalytics?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-blue-600 font-medium mb-1">Avg. Order Value</p>
              <p className="text-xl font-bold text-gray-800">₹{orderAnalytics?.averageOrderValue?.toFixed(2) || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-xs text-purple-600 font-medium mb-1">Conversion Rate</p>
              <p className="text-xl font-bold text-gray-800">{orderAnalytics?.conversionRate?.toFixed(2) || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
              <p className="text-sm text-gray-500">Best sellers by revenue</p>
            </div>
            <button className="text-xs text-indigo-600 hover:text-indigo-800">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-gray-500">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.productName}</p>
                  <p className="text-xs text-gray-500">{product.totalQuantity} sold</p>
                </div>
                <div className="text-sm font-semibold text-indigo-600 ml-2">₹{product.totalRevenue?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Inventory Alerts</h2>
              <p className="text-sm text-gray-500">Items needing attention</p>
            </div>
            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full">{inventoryAlerts.length} alerts</span>
          </div>
          <div className="space-y-3">
            {inventoryAlerts.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center">
                  <FiAlertTriangle className="text-amber-500 mr-2" />
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-amber-700">{item.stock} left</span>
              </div>
            ))}
            {inventoryAlerts.length === 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                No inventory alerts at this time
              </div>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Top Customers</h2>
              <p className="text-sm text-gray-500">Highest spenders in the last 30 days</p>
            </div>
            <button className="text-xs text-indigo-600 hover:text-indigo-800">View All</button>
          </div>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium mr-3">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{customer.name}</p>
                  <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                </div>
                <div className="text-sm font-bold text-blue-700">₹{customer.totalSpent?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Top Categories */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Top Categories</h2>
            <p className="text-sm text-gray-500">Categories with highest revenue</p>
          </div>
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-800 capitalize">{category._id}</span>
                <span className="text-sm font-bold text-purple-700">₹{category.totalRevenue?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Retention Rate */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Customer Retention</h2>
            <p className="text-sm text-gray-500">Retention rate in the last 30 days</p>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray={`${customerRetention?.retentionRate || 0}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{customerRetention?.retentionRate?.toFixed(2) || 0}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{customerRetention?.returningCustomers || 0}</span> returning customers
              </p>
              <p className="text-sm text-gray-600">
                out of <span className="font-medium">{customerRetention?.totalCustomers || 0}</span> total
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;