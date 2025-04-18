import React from 'react';
import Navbar from '../components/Shared/Navbar';
import Sidebar from '../components/Shared/Sidebar';
import { Outlet } from 'react-router-dom';
import { useSidebar } from '../context/SideBarcontext';

function Home() {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={`flex-1 overflow-auto transition-all duration-200 ${
            isSidebarOpen ? "md:ml-64" : "md:ml-20"
          }`}
        >
         
            <Outlet />
        
        </main>
      </div>
    </div>
  );
}

export default Home;