
import React, { useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Burger Button */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
                    onClick={toggleSidebar}
                >
                    <FiMenu size={24} />
                </button>

                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-bold text-indigo-600">ShopCart</Link>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 mx-10">
                    <div className="relative w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600">
                            <FiSearch size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation Icons */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-600 hover:text-indigo-600 relative">
                        <FiHeart size={20} />
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-indigo-600 relative">
                        <FiShoppingCart size={20} />
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">5</span>
                    </button>
                    {user ? (
                        <div className="relative group">
                            <button className="p-2 text-gray-600 hover:text-indigo-600">
                                <FiUser size={20} />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                    Hi, {user.name}
                                </div>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="p-2 text-gray-600 hover:text-indigo-600"
                        >
                            <FiUser size={20} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 md:hidden">
                    <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50">
                        <div className="p-4 flex justify-between items-center border-b">
                            <h3 className="text-lg font-semibold">Menu</h3>
                            <button
                                className="p-2 text-gray-600 hover:text-indigo-600"
                                onClick={toggleSidebar}
                            >
                                ✕
                            </button>
                        </div>
                        <nav className="p-4">
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/"
                                        className="block py-2 px-3 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                                        onClick={toggleSidebar}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/products"
                                        className="block py-2 px-3 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                                        onClick={toggleSidebar}
                                    >
                                        Products
                                    </Link>
                                </li>
                                {user ? (
                                    <>
                                        <li>
                                            <Link
                                                to="/profile"
                                                className="block py-2 px-3 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                                                onClick={toggleSidebar}
                                            >
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    toggleSidebar();
                                                }}
                                                className="block w-full text-left py-2 px-3 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link
                                                to="/login"
                                                className="block py-2 px-3 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                                                onClick={toggleSidebar}
                                            >
                                                Login
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/register"
                                                className="block py-2 px-3 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                                                onClick={toggleSidebar}
                                            >
                                                Register
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;