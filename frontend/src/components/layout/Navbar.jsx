import { useSidebar } from "../../context/ToggleSideBar";
import { useUser } from "../../context/userContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiSettings, FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiDashboardLine } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { user, loading } = useUser();
  const dropdownRef = useRef(null);

  console.log("Navbar user:", user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!user || loading) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className={`fixed w-full top-0 z-30 transition-all duration-300 ${
        scrolled ? "bg-amber-500 shadow-lg" : "bg-amber-400 shadow-md"
      }`}
    >
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-3">
        {/* Left section - Hamburger and Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <GiHamburgerMenu className="text-white text-xl" />
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <span className="self-center text-2xl font-bold text-white">
              Kiranawalla
            </span>
          </Link>
        </div>

        {/* Center section - Search (optional) */}
        <div className="hidden md:flex items-center justify-center flex-grow mx-8">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-amber-200" />
            </div>
            <input
              type="text"
              className="block w-full p-2 pl-10 text-sm text-white placeholder-amber-200 bg-amber-500 border border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 focus:outline-none transition-all"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Right section - User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user?.name ?? "Guest"}
              </p>
              <p className="text-xs text-amber-100">
                {(user.contact?.email || user.email) ?? "No email"}
              </p>
            </div>
            <div className="relative">
              <img
                className="w-8 h-8 rounded-full border-2 border-white"
                src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                alt="User profile"
              />
              {dropdownOpen && (
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-20"></div>
              )}
            </div>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="z-50 absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name ?? "Guest"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.contact?.email ?? "No email"}
                  </p>
                </div>
                <ul className="py-1">
                  <li>
                    <Link
                      to="/home/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <RiDashboardLine className="mr-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/home/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiSettings className="mr-2" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors text-left"
                    >
                      <FiLogOut className="mr-2" />
                      Sign out
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;