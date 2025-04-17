
import React from 'react'
import { FiHome, FiShoppingBag, FiStar, FiTruck, FiSettings, FiHelpCircle } from 'react-icons/fi'

function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm hidden md:block overflow-y-auto">
      <div className="p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                <FiHome className="mr-3" size={18} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                <FiShoppingBag className="mr-3" size={18} />
                <span>Products</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                <FiStar className="mr-3" size={18} />
                <span>Favorites</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                <FiTruck className="mr-3" size={18} />
                <span>Orders</span>
              </a>
            </li>
            
            <li className="pt-4 mt-4 border-t border-gray-200">
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                <FiSettings className="mr-3" size={18} />
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                <FiHelpCircle className="mr-3" size={18} />
                <span>Help & Support</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar