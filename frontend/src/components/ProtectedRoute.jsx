import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();

  console.log("Protected route user:", user);
console.log("Protected route role:", user?.role);
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />; // Create this route
  }

  return children;
};

export default ProtectedRoute;