import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductsPage from "./pages/ProductsPage";


import { SidebarProvider } from "./context/SideBarcontext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<ProductsPage />} />
            <Route path="profile" element={<Profile />} />
  
         
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;