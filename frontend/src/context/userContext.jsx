import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!role || !token) {
      setLoading(false);
      return;
    }

    let url = null;

    // Keep original URLs without ID
    if (role === "owner") {
      url = `http://localhost:6565/api/owners/`;
    } else if (
      role === "manager" ||
      role === "cashier" ||
      role === "inventory_staff" ||
      role === "delivery_coordinator"
    ) {
      url = "http://localhost:6565/api/employees/";
    } else if (role === "admin") {
      url = "http://localhost:6565/api/retailers/";
    }

    if (!url) {
      console.warn("No URL set for current role");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
   
        
        // Find current user in response data
        const userId = localStorage.getItem("Id");
        const currentUser = Array.isArray(data.data) 
          ? data.data.find(user => user._id === userId || user.id === userId)
          : data.data;
          console.log("Fetched Data");
          console.log(data);
        if (!currentUser) {
          throw new Error("User not found in response");
        }
        console.log(currentUser);

        setUserData(currentUser);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        // Clear invalid auth data on error
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("Id");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, error, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
