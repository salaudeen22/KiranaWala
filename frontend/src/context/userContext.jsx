import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData, token) => {
  
    const role = userData.role; 

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("Id", userData._id);
    // console.log("User ID:", userData._id);
    localStorage.setItem("email", userData.email);

    setUser({
      ...userData,
      token,
      role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("Id");
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("Id");
    
      if (!token || !role || !userId) {
        setLoading(false);
        return;
      }
    
      try {
        let endpoint;
        if (role === "owner") {
          endpoint = `http://localhost:6565/api/owners/`;
        } else if (
          ["manager", "cashier", "inventory_staff", "delivery_coordinator"].includes(role)
        ) {
          endpoint = `http://localhost:6565/api/employees/`;
        } else if (role === "admin") {
          endpoint = `http://localhost:6565/api/retailers/`;
        }
    
        // console.log("Role:", role);
        // console.log("Endpoint:", endpoint);
    
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
    
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format: Expected JSON");
        }
    
        const data = await response.json();
        let currentUser;
        if (Array.isArray(data.data)) {
          currentUser = data.data.find(u => u._id === userId);
        } else {
          currentUser = data.data || data;
        }
        
        if (!currentUser) throw new Error("Current user not found");
        
        // console.log("User Data:", data);
    
        setUser({
          ...currentUser,
          role // Ensure role is set from localStorage
        });
      } catch (err) {
        console.error("Failed to load user:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
