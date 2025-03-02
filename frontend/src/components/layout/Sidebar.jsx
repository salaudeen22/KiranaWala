import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaCalculator, FaUserEdit, FaUserFriends } from "react-icons/fa"; 
import { useSidebar } from "../../context/ToggleSideBar";

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-16 left-0 z-40 h-full bg-amber-300 text-white p-6 transition-all duration-300 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="space-y-4">
        <li
          className="flex items-center space-x-3 hover:bg-amber-200 p-2 rounded-lg"
          onClick={() => navigate("/home/dashboard")} 
        >
          <FaTachometerAlt className="text-xl" />
          <span className="text-lg">Dashboard</span>
        </li>
        <li
          className="flex items-center space-x-3 hover:bg-amber-200 p-2 rounded-lg"
          onClick={() => navigate("/home/inventory")} 
        >
          <FaBox className="text-xl" />
          <span className="text-lg">Inventory</span>
        </li>
        <li
          className="flex items-center space-x-3 hover:bg-amber-200 p-2 rounded-lg"
          onClick={() => navigate("/home/sales")} 
        >
          <FaCalculator className="text-xl" />
          <span className="text-lg">Billing</span>
        </li>
        <li
          className="flex items-center space-x-3 hover:bg-amber-200 p-2 rounded-lg"
          onClick={() => navigate("/home/usermanagment")} 
        >
          <FaUserFriends className="text-xl" />
          <span className="text-lg">User Managment</span>
        </li>
        <li
          className="flex items-center space-x-3 hover:bg-amber-200 p-2 rounded-lg"
          onClick={() => navigate("/home/profile")} 
        >
          <FaUserEdit className="text-xl" />
          <span className="text-lg">Edit Profile</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
