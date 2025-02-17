import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/ToggleSideBar";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md fixed w-full top-0 z-30">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <GiHamburgerMenu className="text-gray-500 dark:text-white mr-4" onClick={toggleSidebar} />
        <a href="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold text-gray-900 dark:text-white">
            Kiranwalla
          </span>
        </a>

        <div className="flex items-center justify-center flex-grow relative">
          <div
            className={`relative hidden md:block w-1/2 ${
              menuOpen ? "absolute top-0 left-0 right-0 z-50" : ""
            }`}
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <CiSearch className="text-gray-500 dark:text-white sm:hidden" />
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>

       
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            aria-expanded={dropdownOpen ? "true" : "false"}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              alt="user photo"
            />
          </button>

          {dropdownOpen && (
            <div className="z-50 absolute right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  Bonnie Green
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  name@flowbite.com
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => {
                      handleLogout();
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
