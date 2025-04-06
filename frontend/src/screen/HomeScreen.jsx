import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { UserProvider } from "../context/userContext";

function HomeScreen() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("Id");
    console.log("Auth check:", { token, role, id });
    
    const authStatus = !!token && !!role && !!id;
    setIsAuthenticated(authStatus);
    setAuthChecked(true);
    
    if (!authStatus) {
      console.log("Not authenticated, redirecting to login");
      // Clear invalid auth data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("Id");
    }
  }, [location.pathname]); // Re-check auth when route changes

  if (!authChecked) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    console.log("Redirecting to login from HomeScreen");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="bg-#FEFBEF">
      <UserProvider>
        <Sidebar />
        <Navbar />
        <div className="mt-14">
          <Outlet />
        </div>
      </UserProvider>
    </div>
  );
}

export default HomeScreen;