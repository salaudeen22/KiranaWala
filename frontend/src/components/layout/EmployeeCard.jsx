import React from "react";
import { Mail, Phone, CreditCard, Fingerprint, Edit, Trash2 } from "lucide-react";

const EmployeeCard = ({ employee, handleEditClick, handleDelete }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              className="h-10 w-10 rounded-full object-cover border" 
              src={employee.profileImage || "https://via.placeholder.com/150"} 
              alt={employee.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
                e.target.className = "h-10 w-10 rounded-full bg-gray-200";
              }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
        <div className="text-xs text-gray-500">ID: {employee._id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center">
          <Mail className="mr-1 text-gray-400" size={14} /> {employee.email}
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <Phone className="mr-1 text-gray-400" size={14} /> {employee.phone || "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          employee.role === "manager" 
            ? "bg-purple-100 text-purple-800" 
            : "bg-blue-100 text-blue-800"
        }`}>
          {employee.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <div className="text-sm text-gray-500 flex items-center">
            <CreditCard className="mr-1 text-gray-400" size={14} /> 
            PAN: {employee.panCard || "N/A"}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Fingerprint className="mr-1 text-gray-400" size={14} /> 
            Aadhaar: {employee.aadhaarCard || "N/A"}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(employee)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(employee._id)}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EmployeeCard;