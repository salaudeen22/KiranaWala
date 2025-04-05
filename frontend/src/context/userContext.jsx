import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  var url=null;

  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("Id");
  
    let url = null;
    if (role === "owner") {
      url = `http://localhost:6565/api/owners/${id}`;
    }
  
    if (!url) return;
  
    const fetchUserData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user data");
  
        const data = await response.json();
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };
  
    fetchUserData();
  }, []);
 

  return (
    <UserContext.Provider value={{ userData, setUserData, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
