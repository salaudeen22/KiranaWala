import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmployeeTable from "../components/layout/EmployeeTable";
import EmployeeForm from "../components/layout/EmployeeForm";
import SearchBar from "../components/layout/SearchBar";

const UserManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [retailerId, setRetailerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    password: "defaultPassword123", // Default password
    role: "cashier",
    retailerId: "",
    panCard: "",
    aadhaarCard: "",
    profileImage: ""
  });

  useEffect(() => {
    const storedRetailerId = localStorage.getItem("retailId");
    const token = localStorage.getItem("token");
    console.log(token);
    
    if (!token) {
      alert("Authentication required. Please login again.");
      // You might want to redirect to login here
      return;
    }

    if (storedRetailerId) {
      setRetailerId(storedRetailerId);
      setNewEmployee(prev => ({ ...prev, retailerId: storedRetailerId }));
      fetchEmployeeData(token, storedRetailerId);
    }
  }, []);

  const fetchEmployeeData = async (token, retailerId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:6565/api/employees?retailerId=${retailerId}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      
      const data = await response.json();
      setEmployeeData(data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch("http://localhost:6565/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
  
      if (!response.ok) throw new Error("Upload failed");
  
      const data = await response.json();
      if (data.imageUrl) {
        setNewEmployee(prev => ({ ...prev, profileImage: data.imageUrl }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee);
    setIsEditOpen(true);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      password: "", // Don't pre-fill password for security
      role: employee.role,
      retailerId: employee.retailerId,
      panCard: employee.documents?.panCard || "",
      aadhaarCard: employee.documents?.aadhaarCard || "",
      profileImage: employee.profileImage || ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone) {
      alert("Please fill in all required fields");
      return;
    }
  
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const url = currentEmployee 
        ? `http://localhost:6565/api/employees/${currentEmployee._id}`
        : "http://localhost:6565/api/employees/add";
      
      const method = currentEmployee ? "PUT" : "POST";
      
      const requestBody = {
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        password: newEmployee.password,
        role: newEmployee.role,
        retailerId: newEmployee.retailerId,
        documents: {
          panCard: newEmployee.panCard,
          aadhaarCard: newEmployee.aadhaarCard
        },
        userImage: newEmployee.profileImage
      };
  
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save employee");
      }
  
      await fetchEmployeeData(token, retailerId);
      setIsOpen(false);
      setIsEditOpen(false);
      resetForm();
      
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`http://localhost:6565/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      await fetchEmployeeData(token, retailerId);
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(error.message);
    }
  };

  const filteredEmployees = employeeData.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.phone.includes(search) ||
    emp.role.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setNewEmployee({ 
      name: "", 
      email: "", 
      phone: "", 
      password: "defaultPassword123",
      role: "cashier", 
      retailerId, 
      panCard: "", 
      aadhaarCard: "", 
      profileImage: "" 
    });
    setCurrentEmployee(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500">Manage your employees and their access</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          <Plus className="mr-2" size={18} /> 
          Add Employee
        </motion.button>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <EmployeeTable 
        employees={filteredEmployees} 
        isLoading={isLoading} 
        handleEditClick={handleEditClick} 
        handleDelete={handleDelete} 
      />

      {/* Add Employee Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Employee</h2>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
            <EmployeeForm 
              employeeData={newEmployee}
              handleSubmit={handleSubmit}
              handleImageUpload={handleImageUpload}
              setEmployeeData={setNewEmployee}
              isLoading={isLoading}
              onClose={() => {
                setIsOpen(false);
                resetForm();
              }}
              isEditMode={false}
            />
          </motion.div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Edit Employee</h2>
              <button 
                onClick={() => {
                  setIsEditOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
            <EmployeeForm 
              employeeData={newEmployee}
              handleSubmit={handleSubmit}
              handleImageUpload={handleImageUpload}
              setEmployeeData={setNewEmployee}
              isLoading={isLoading}
              onClose={() => {
                setIsEditOpen(false);
                resetForm();
              }}
              isEditMode={true}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;