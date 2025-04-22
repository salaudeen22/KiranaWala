import { createContext, useContext, useState, useEffect } from 'react';
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user and token from localStorage on app initialization
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Fetch profile when token changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:6565/api/customers/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data.data);
           
            localStorage.setItem('user', JSON.stringify(data.data)); 
          } else {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:6565/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('authToken', data.token); // Persist token
        localStorage.setItem('user', JSON.stringify(data.user)); // Persist user data
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:6565/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You can now log in with your credentials.',
        });
        return { success: true };
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.message || 'Something went wrong.',
        });
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to the server. Please try again later.',
      });
      return { success: false, message: 'Network error' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch('http://localhost:6565/api/customers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully.',
        });
        return { success: true };
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: data.message || 'Unable to update profile.',
        });
        return { success: false, message: data.message || 'Update failed' };
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to the server. Please try again later.',
      });
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};