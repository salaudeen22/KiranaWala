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
  Filler
} from "chart.js";
import React from "react";
import { Line, Pie, Bar } from "react-chartjs-2";

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
  // Sales trend data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Total Sales",
        data: [5000, 7000, 8000, 6000, 9000, 12000, 10000, 11000, 9500, 14000, 13000, 15000],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#6366F1",
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: "Total Costs",
        data: [3000, 4000, 4500, 3800, 5000, 6000, 5500, 5700, 4900, 8000, 7000, 8500],
        borderColor: "#EC4899",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#EC4899",
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };

  // Sales distribution data
  const pieData = {
    labels: ["Online Sales", "Retail Sales", "Wholesale"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ["#10B981", "#F59E0B", "#3B82F6"],
        borderWidth: 0,
        hoverOffset: 10
      },
    ],
  };

  // Performance metrics
  const metrics = [
    { name: "Revenue", value: "₹256.82K", change: "+5.23%", trend: "up", icon: "💰" },
    { name: "Orders", value: "1,234", change: "+12.5%", trend: "up", icon: "📦" },
    { name: "Customers", value: "3,456", change: "+8.2%", trend: "up", icon: "👥" },
    { name: "Avg. Order", value: "₹208", change: "-2.3%", trend: "down", icon: "📊" },
    { name: "Conversion", value: "3.2%", change: "+0.4%", trend: "up", icon: "🔄" },
    { name: "Returns", value: "5.1%", change: "-1.2%", trend: "down", icon: "↩️" }
  ];

  // Top products data
  const topProducts = [
    { name: "Premium Headphones", sales: 342, revenue: "₹45,231" },
    { name: "Wireless Earbuds", sales: 298, revenue: "₹32,456" },
    { name: "Smart Watch", sales: 256, revenue: "₹28,745" },
    { name: "Bluetooth Speaker", sales: 187, revenue: "₹21,098" }
  ];

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
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full">Year</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Quarter</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Month</button>
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
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      padding: 20
                    }
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 12 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false
                    },
                    ticks: {
                      callback: function(value) {
                        return '₹' + value.toLocaleString();
                      }
                    }
                  }
                },
                elements: {
                  line: {
                    borderWidth: 2
                  }
                }
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
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                      label: function(context) {
                        return `${context.label}: ${context.raw}%`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
          <div className="space-y-3">
            {pieData.labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: pieData.datasets[0].backgroundColor[index] }}
                  ></div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{pieData.datasets[0].data[index]}%</span>
              </div>
            ))}
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
                  <p className="text-sm font-medium text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} sold</p>
                </div>
                <div className="text-sm font-semibold text-indigo-600">{product.revenue}</div>
              </div>
            ))}
          </div>
          <a href="#" className="block text-center text-sm text-indigo-600 font-medium mt-4 hover:underline">
            View all products
          </a>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Inventory Alerts</h2>
            <p className="text-sm text-gray-500">Items needing attention</p>
          </div>
          <div className="space-y-4">
            {/* Low Stock */}
            <div className="p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="p-1 bg-amber-100 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-800">Low Stock Items</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-xs py-1 px-2 bg-white rounded">
                  <span>Premium Headphones</span>
                  <span className="font-bold text-amber-700">3 left</span>
                </li>
                <li className="flex justify-between items-center text-xs py-1 px-2 bg-white rounded">
                  <span>Wireless Earbuds</span>
                  <span className="font-bold text-amber-700">2 left</span>
                </li>
                <li className="flex justify-between items-center text-xs py-1 px-2 bg-white rounded">
                  <span>Smart Watch</span>
                  <span className="font-bold text-amber-700">1 left</span>
                </li>
              </ul>
            </div>

            {/* Expiring Soon */}
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="p-1 bg-red-100 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-800">Expiring Soon</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-xs py-1 px-2 bg-white rounded">
                  <span>Bluetooth Speaker (Gen 1)</span>
                  <span className="font-bold text-red-700">5 days</span>
                </li>
                <li className="flex justify-between items-center text-xs py-1 px-2 bg-white rounded">
                  <span>Wired Headphones</span>
                  <span className="font-bold text-red-700">12 days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <p className="text-sm text-gray-500">Latest customer purchases</p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((order) => (
              <div key={order} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 text-xs">#{order}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Customer {order}</p>
                  <p className="text-xs text-gray-500">2 items • ₹{(120 + order * 25).toFixed(2)}</p>
                </div>
                <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Completed</div>
              </div>
            ))}
          </div>
          <a href="#" className="block text-center text-sm text-indigo-600 font-medium mt-4 hover:underline">
            View all orders
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;