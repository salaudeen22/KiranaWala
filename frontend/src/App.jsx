import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./screen/Dashboard";
import HomeScreen from "./screen/HomeScreen";
import Inventory from "./screen/Inventory";
import Profile from "./screen/Profile";
import Sales from "./screen/Sales";
import Login from "./screen/auth/Login";
import SignUp from "./screen/auth/SignUp";
import UserManagement from "./screen/UserManagement";
import OwnerSignUp from "./screen/auth/OwnerSignUp";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onwersignup" element={<OwnerSignUp />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route path="/home" element={<HomeScreen />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="sales" element={<Sales />} />
        <Route path="usermanagment" element={<UserManagement />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Catch-all route for undefined paths */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;