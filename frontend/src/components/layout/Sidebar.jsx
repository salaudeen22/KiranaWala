import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaBox, 
  FaCalculator, 
  FaUserEdit, 
  FaUserFriends,
  FaChevronRight
} from "react-icons/fa";
import { useSidebar } from "../../context/ToggleSideBar";

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/home/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/home/inventory", icon: <FaBox />, label: "Inventory" },
    { path: "/home/sales", icon: <FaCalculator />, label: "Billing" },
    { path: "/home/usermanagment", icon: <FaUserFriends />, label: "User Management" },
    { path: "/home/profile", icon: <FaUserEdit />, label: "Edit Profile" }
  ];

  return (
    <div
      className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-amber-500 to-amber-600 text-white p-4 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-center mb-8 p-4">
        <h2 className="text-xl font-bold text-white">Menu</h2>
      </div>
      
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-amber-400 hover:shadow-md cursor-pointer ${
              location.pathname === item.path ? "bg-amber-700 shadow-inner" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-md font-medium">{item.label}</span>
            </div>
            <FaChevronRight className="text-sm opacity-70" />
          </li>
        ))}
      </ul>

      {/* Footer area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-amber-100 border-t border-amber-400">
        v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;