import React from "react";
import {  Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { SidebarProvider } from "./context/SideBarcontext";

const App = () => {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home/>} />
       ` <Route path="/profile" element={<Profile/>} />`
      </Routes>
    </SidebarProvider>
  );
};

export default App;
