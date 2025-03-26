import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet, Navigate } from "react-router-dom";
import { UserProvider } from "../context/userContext";

function HomeScreen() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   // Check if user is authenticated (e.g., token exists in localStorage)
  //   const token = localStorage.getItem("token");
  //   setIsAuthenticated(!!token);
  // }, []);

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  

  return (
    <div className="bg-#FEFBEF">
      <Sidebar />
      <UserProvider>
        <Navbar /> 
        <div className="mt-14">
          <Outlet /> 
        </div>
      </UserProvider>
    </div>
  );
}

export default HomeScreen;