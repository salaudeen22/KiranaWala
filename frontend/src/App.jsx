import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/userContext";
import Dashboard from "./screen/Dashboard";
import HomeScreen from "./screen/HomeScreen";
import Inventory from "./screen/Inventory";
import NotAuthorized from "./screen/NotAuthorized";
import Profile from "./screen/Profile";
import Sales from "./screen/Sales";
import UserManagement from "./screen/UserManagement";
import Login from "./screen/auth/Login";
import OwnerSignUp from "./screen/auth/OwnerSignUp";
import SignUp from "./screen/auth/SignUp";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ownersignup" element={<OwnerSignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        {/* Protected parent route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "manager",
                "owner",
                "cashier",
                "inventory_staff",
                "delivery_coordinator",
              ]}
            >
              <HomeScreen />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard - accessible to all roles */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Inventory - accessible to admin, manager, inventory_staff */}
          <Route
            path="inventory"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "manager", "inventory_staff"]}
              >
                <Inventory />
              </ProtectedRoute>
            }
          />

          {/* Sales - accessible to cashier and manager */}
          <Route
            path="sales"
            element={
              <ProtectedRoute allowedRoles={["cashier", "manager"]}>
                <Sales />
              </ProtectedRoute>
            }
          />

          {/* User Management - accessible only to admin */}
          <Route
            path="usermanagment"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* Profile - accessible to all */}
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
