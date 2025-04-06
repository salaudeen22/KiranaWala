import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { FaStore, FaUserTie, FaUserCog } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("vendor"); // 'vendor', 'employee', or 'admin'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Determine the appropriate API endpoint based on user type
      let endpoint = "";
      switch(userType) {
        case "vendor":
          endpoint = "http://localhost:6565/api/owners/login";
          break;
        case "employee":
          endpoint = "http://localhost:6565/api/employees/login";
          break;
        case "admin":
          endpoint = "http://localhost:6565/api/retailers/login";
          break;
        default:
          endpoint = "http://localhost:6565/api/vendor/auth/login";
      }
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
     
      
      const json = await response.json();
      console.log(json);
      
      if (response.status === 200) {
        localStorage.setItem("token", json.token);
        
        // Store different IDs based on user type
        if (userType === "vendor") {
          localStorage.setItem("Id", json.data.user._id);
          localStorage.setItem("email", json.data.user.email);
          localStorage.setItem("role", json.data.user.role);
        } else if (userType === "employee") {
      
          localStorage.setItem("Id", json.data.user._id); 
          localStorage.setItem("email", json.data.user.email);
          localStorage.setItem("role", json.data.user.role);
           
          
        } else if (userType === "admin") {
          localStorage.setItem("Id", json.data.user._id);
          localStorage.setItem("email", json.data.user.email);
          localStorage.setItem("role", json.data.user.role);
        }
        
        // Success animation before navigation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to appropriate dashboard based on user type
        switch(userType) {
          case "vendor":
            navigate("/home/dashboard");
            break;
          case "employee":
            // navigate("/employee/dashboard");
            navigate("/home/dashboard");
            break;
          case "admin":
            // navigate("/home/dashboard");
            navigate("/home/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError(json.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 to-indigo-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container flex flex-col md:flex-row items-center justify-center bg-white shadow-2xl rounded-xl overflow-hidden w-full max-w-4xl"
      >
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-700 justify-center items-center p-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            {userType === "vendor" ? (
              <FaStore className="text-white text-6xl mx-auto mb-4" />
            ) : userType === "employee" ? (
              <FaUserTie className="text-white text-6xl mx-auto mb-4" />
            ) : (
              <FaUserCog className="text-white text-6xl mx-auto mb-4" />
            )}
            <h1 className="text-4xl font-bold text-white mb-2">
              {userType === "vendor" ? "KiranaWalla" : 
               userType === "employee" ? "Employee Portal" : "Admin Portal"}
            </h1>
            <p className="text-blue-100 text-lg">
              {userType === "vendor" ? "Your neighborhood store management" :
               userType === "employee" ? "Access your work dashboard" : "System administration"}
            </p>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {userType === "vendor" ? "Vendor Login" : 
               userType === "employee" ? "Employee Login" : "Admin Login"}
            </h2>
            <p className="text-gray-600">
              {userType === "vendor" ? "Sign in to manage your store" :
               userType === "employee" ? "Sign in to access your tasks" : "Sign in to administer the system"}
            </p>
          </div>

          {/* User Type Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setUserType("vendor")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                  userType === "vendor"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => setUserType("employee")}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  userType === "employee"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setUserType("admin")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                  userType === "admin"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Sign In as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
              )}
            </motion.button>
          </form>

          {userType === "vendor" && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 font-medium hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;