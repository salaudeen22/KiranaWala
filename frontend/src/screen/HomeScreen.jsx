import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/navBar";
import { Outlet } from "react-router-dom";
import { UserProvider } from "../context/userContext";

function HomeScreen() {
 

  return (
    <div className="bg-#FEFBEF">
      <Sidebar />
      <UserProvider>
      <Navbar /> 
      <div className="mt-14 ">
        <Outlet  /> 
      </div>
      </UserProvider>
    </div>
  );
}

export default HomeScreen;
