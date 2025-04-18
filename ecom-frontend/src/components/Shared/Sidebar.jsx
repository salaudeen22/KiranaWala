import React from 'react';
import { 
  FiHome, FiShoppingBag, FiStar, 
  FiTruck, FiSettings, FiHelpCircle,
  FiClock, FiTag, FiUsers, FiHeart
} from 'react-icons/fi';
import { useSidebar } from '../../context/SideBarcontext';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const { isSidebarOpen } = useSidebar();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: FiHome, label: "Home" },
    { path: "/products", icon: FiShoppingBag, label: "Products" },
    { path: "/deals", icon: FiTag, label: "Hot Deals", badge: "New" },
    { path: "/quick-delivery", icon: FiClock, label: "Quick Delivery" },
    { path: "/wishlist", icon: FiHeart, label: "Wishlist" },
    { path: "/my-orders", icon: FiTruck, label: "My Orders" }, 

    { path: "/settings", icon: FiSettings, label: "Settings" },
    { path: "/profile", icon: FiUsers, label: "My Profile" },
    { path: "/help", icon: FiHelpCircle, label: "Help Center" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"}`}
      style={{ height: 'calc(100vh - 4rem)', top: '4rem' }}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex-1 overflow-y-auto">
          <nav>
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                item.type === "divider" ? (
                  <li key={index} className="my-3 px-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </li>
                ) : (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 group
                        ${location.pathname === item.path 
                          ? 'bg-gradient-to-r from-indigo-100 to-purple-50 text-indigo-600 border-l-4 border-indigo-500' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'}`}
                    >
                      <item.icon 
                        className={`mr-3 ${location.pathname === item.path ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'}`} 
                        size={20} 
                      />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiUsers className="text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;