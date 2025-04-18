import React from 'react';
import { 
  FiHome, FiShoppingBag, FiStar, 
  FiTruck, FiSettings, FiHelpCircle,
  FiClock, FiTag, FiUsers
} from 'react-icons/fi';
import { useSidebar } from '../../context/SideBarcontext';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const { isSidebarOpen } = useSidebar();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: FiHome, label: "Home" },
    { path: "/products", icon: FiShoppingBag, label: "Products" },
    { path: "/deals", icon: FiTag, label: "Deals" },
    { path: "/quick-delivery", icon: FiClock, label: "Quick Delivery" },
    { path: "/favorites", icon: FiStar, label: "Favorites" },
    { path: "/orders", icon: FiTruck, label: "Orders" },
    { path: "/customers", icon: FiUsers, label: "Customers" },
    { type: "divider" },
    { path: "/settings", icon: FiSettings, label: "Settings" },
    { path: "/help", icon: FiHelpCircle, label: "Help & Support" },
  ];

  return (
    <aside
      className={`fixed top-15 left-0 h-full bg-gray-800 text-white transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 mt-10">
       

        <nav>
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              item.type === "divider" ? (
                <li key={index} className="border-t border-gray-200 my-2"></li>
              ) : (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors
                      ${location.pathname === item.path 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  >
                    <item.icon className="mr-3" size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;