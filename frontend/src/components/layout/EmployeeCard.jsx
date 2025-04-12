import React from "react";
import { Mail, Phone, CreditCard, Fingerprint, Edit, Trash2 } from "lucide-react";

const EmployeeCard = ({ employee, handleEditClick, handleDelete }) => {
  // Safely extract all employee data with fallbacks
  const {
    _id = '',
    name = 'Unknown',
    email = 'No email',
    phone = 'Not provided',
    role = 'unknown',
    employeeId = 'N/A',
    documents = {},
    employmentDetails = {},
    profileImage = '',
    userImage = '',
    lastLogin = '',
    createdAt = ''
  } = employee || {};

  const { panCard = 'Not provided', aadhaarCard = 'Not provided' } = documents;
  const { salary = 'N/A', joiningDate = '', isActive = false } = employmentDetails;

  // Use profileImage if available, otherwise userImage, otherwise fallback
  const imageUrl = profileImage || userImage || "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png";

  // Format dates
  const formattedJoiningDate = joiningDate ? new Date(joiningDate).toLocaleDateString() : 'Unknown';
  const formattedLastLogin = lastLogin ? new Date(lastLogin).toLocaleString() : 'Never';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Profile Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              className="h-10 w-10 rounded-full object-cover border" 
              src={imageUrl} 
              alt={name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
                e.target.className = "h-10 w-10 rounded-full bg-gray-200";
              }}
            />
          </div>
        </div>
      </td>

      {/* Name Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-xs text-gray-500">ID: {employeeId}</div>
        <div className="text-xs text-gray-400 mt-1">
          Joined: {formattedJoiningDate}
        </div>
      </td>

      {/* Contact Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center">
          <Mail className="mr-1 text-gray-400" size={14} /> {email}
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <Phone className="mr-1 text-gray-400" size={14} /> {phone}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Last login: {formattedLastLogin}
        </div>
      </td>

      {/* Role Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          role === "manager" 
            ? "bg-purple-100 text-purple-800" 
            : role === "cashier"
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {role}
        </span>
        <div className="text-xs text-gray-500 mt-1">
          Status: {isActive ? 'Active' : 'Inactive'}
        </div>
        {salary && (
          <div className="text-xs text-gray-500 mt-1">
            Salary: ₹{salary.toLocaleString()}
          </div>
        )}
      </td>

      {/* Documents Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <div className="text-sm text-gray-500 flex items-center">
            <CreditCard className="mr-1 text-gray-400" size={14} /> 
            PAN: {panCard}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Fingerprint className="mr-1 text-gray-400" size={14} /> 
            Aadhaar: {aadhaarCard}
          </div>
        </div>
      </td>

      {/* Actions Column */}
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
            onClick={() => handleDelete(_id)}
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