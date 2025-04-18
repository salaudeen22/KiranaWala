import React from "react";
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useSidebar } from "../../context/SideBarcontext";

function Navbar() {
  const { user, logout } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const handleToggle = () => {
    console.log("Toggling sidebar", !isSidebarOpen);
    toggleSidebar();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggle}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            {isSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link to="/" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors">
            KiranaWalla
          </Link>
        </div>

        <div className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600">
              <FiSearch size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-green-600 relative transition-colors">
            <FiHeart size={20} />
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <Link to="/cart" className="p-2 text-gray-600 hover:text-green-600 relative transition-colors">
            <FiShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              5
            </span>
          </Link>
          
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 p-2 text-gray-600 hover:text-green-600 transition-colors">
                <FiUser size={20} />
                <span className="hidden md:inline-block text-sm">{user.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-100">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  Hi, {user.name.split(' ')[0]}
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1 p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <FiUser size={20} />
              <span className="hidden md:inline-block text-sm">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;