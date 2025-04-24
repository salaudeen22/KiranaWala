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
          { name: "Revenue", value: `₹${salesJson.data.summary.totalSales.toLocaleString()}`, change: "+5.23%", trend: "up", icon: "💰" },
          { name: "Orders", value: salesJson.data.summary.totalBroadcasts, change: "+12.5%", trend: "up", icon: "📦" },
          { name: "Avg. Order", value: `₹${salesJson.data.summary.averageBroadcastValue.toFixed(2)}`, change: "-2.3%", trend: "down", icon: "📊" },
        ]);

        // Fetch top products
        const productsResponse = await fetch("http://localhost:6565/api/analytics/sales-by-product?timeRange=30d&limit=4", { headers });
        const productsJson = await productsResponse.json();
        setTopProducts(productsJson.data || []);

        // Fetch inventory alerts
        const inventoryResponse = await fetch("http://localhost:6565/api/analytics/stock-levels?threshold=5", { headers });
        const inventoryJson = await inventoryResponse.json();
        setInventoryAlerts(inventoryJson.data.products || []);
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen w-full p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{metric.name}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{metric.value}</p>
              </div>
              <span className="text-lg">{metric.icon}</span>
            </div>
            <div className={`mt-2 flex items-center text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {metric.trend === "up" ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Trend */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Sales Performance</h2>
              <p className="text-sm text-gray-500">Monthly revenue vs costs</p>
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
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
                    },
                    ticks: {
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
                },
              }}
            />
          </div>
        </div>

        {/* Sales Distribution */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Channels</h2>
            <p className="text-sm text-gray-500">Sales distribution by channel</p>
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
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
            <p className="text-sm text-gray-500">Best sellers by revenue</p>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-500 text-lg">📦</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{product.productName}</p>
                  <p className="text-xs text-gray-500">{product.totalQuantity} sold</p>
                </div>
                <div className="text-sm font-semibold text-indigo-600">₹{product.totalRevenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Inventory Alerts</h2>
            <p className="text-sm text-gray-500">Items needing attention</p>
          </div>
          <div className="space-y-4">
            {inventoryAlerts.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm py-2 px-3 bg-amber-50 rounded-lg">
                <span>{item.name}</span>
                <span className="font-bold text-amber-700">{item.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;