import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/navBar";
import { Outlet } from "react-router-dom";

function HomeScreen() {
  return (
    <div className="bg-#FEFBEF">
      <Sidebar />
      <Navbar />
      <div className="ml-0 lg:ml-0 mt-12 p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default HomeScreen;
