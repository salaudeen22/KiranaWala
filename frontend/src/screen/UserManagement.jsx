import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const UserManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [employeData, setEmployeData] = useState([]);
  const [retailerId, setretailerId] = useState();
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "employee",
    retailerId: retailerId,
    panCard: "",
    aadhaarCard: "",
    profileImage: "",
  });

  useEffect(() => {
    const storedRetailerId = localStorage.getItem("retailId") || "";
    setretailerId(storedRetailerId);
    setNewEmployee((prev) => ({ ...prev, retailerId: storedRetailerId }));
    fetchEmpData();
  }, []);

  const fetchEmpData = async () => {
    try {
      const response = await fetch("http://localhost:6565/api/employees/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployeData(data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmit = async () => {
    if (!newEmployee.retailerId) {
      console.log("Retailer ID is missing!");
      return;
    }
    try {
      const response = await fetch("http://localhost:6565/api/employees/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (response.ok) {
        fetchEmpData();
        setIsOpen(false);
        setNewEmployee({ name: "", email: "", phone: "", retailerId, role: "employee", panCard: "", aadhaarCard: "", profileImage: "" });
      }
    } catch (error) {
      console.log("Error adding employee:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("http://localhost:6565/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.imageUrl) {
        setNewEmployee((prev) => ({ ...prev, profileImage: data.imageUrl }));
      }
      console.log("Image Sucess");
    } catch (error) {
      console.log("Image upload failed", error);
    }
  };

  return (
    <motion.div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <button onClick={() => setIsOpen(true)} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded">
          <Plus className="mr-2" size={16} /> Add Employee
        </button>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search employees..."
          className="pl-10 border rounded p-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Profile</th>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">panCard</th>
            <th className="border p-2">aadhaarCard</th>
          </tr>
        </thead>
        <tbody>
          {employeData.filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase())).map((emp) => (
            <tr key={emp.id} className="text-center border-t">
              <td className="border p-2"><img src={emp.userImage} className="h-1/2 w-1/2"></img></td>
              <td className="border p-2">{emp._id}</td>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.email}</td>
              <td className="border p-2">{emp.role}</td>
              <td className="border p-2">{emp.panCard}</td>
              <td className="border p-2">{emp.aadhaarCard}</td>


            </tr>
          ))}
        </tbody>
      </table>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
            <input className="border p-2 w-full mb-2" placeholder="Full Name" value={newEmployee.name} onChange={(e) => setNewEmployee((prev) => ({ ...prev, name: e.target.value }))} />
            <input className="border p-2 w-full mb-2" placeholder="Email" type="email" value={newEmployee.email} onChange={(e) => setNewEmployee((prev) => ({ ...prev, email: e.target.value }))} />
            <input className="border p-2 w-full mb-2" placeholder="Phone Number" type="tel" value={newEmployee.phone} onChange={(e) => setNewEmployee((prev) => ({ ...prev, phone: e.target.value }))} />
            <select className="border p-2 w-full mb-4" value={newEmployee.role} onChange={(e) => setNewEmployee((prev) => ({ ...prev, role: e.target.value }))}>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            <input className="border p-2 w-full mb-2" placeholder="PAN Card" type="text" value={newEmployee.panCard} onChange={(e) => setNewEmployee((prev) => ({ ...prev, panCard: e.target.value }))} />
            <input className="border p-2 w-full mb-2" placeholder="Aadhaar Card" type="text" value={newEmployee.aadhaarCard} onChange={(e) => setNewEmployee((prev) => ({ ...prev, aadhaarCard: e.target.value }))} />
            <input type="file" accept=".jpg,.png,.jpeg" onChange={handleImageUpload} />
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 w-full rounded mt-2">Save Employee</button>
            <button onClick={() => setIsOpen(false)} className="mt-2 text-red-500 w-full">Cancel</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;
