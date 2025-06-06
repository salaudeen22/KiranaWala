import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import Wishlist from "./pages/Wishlist";
import MyOrder from "./pages/MyOrder"; // Import MyOrder page
import { SidebarProvider } from "./context/SideBarcontext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import HelpCenter from "./pages/HelpCenter";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SidebarProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            >
              <Route index element={<LandingPage />} />
              <Route path="Allproduct" element={<ProductsPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="my-orders" element={<MyOrder />} /> 
              <Route path="help" element={<HelpCenter />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </SidebarProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
