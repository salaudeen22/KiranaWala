import React from "react";
import { User, Mail, Phone,Plus, Shield, CreditCard, Fingerprint, ChevronDown } from "lucide-react";

const EmployeeForm = ({ 
  employeeData, 
  handleSubmit, 
  handleImageUpload, 
  setEmployeeData, 
  isLoading, 
  onClose,
  isEditMode
}) => {
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {/* Profile Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img 
              className="h-16 w-16 rounded-full object-cover border" 
              src={employeeData.profileImage || "https://via.placeholder.com/150"} 
              alt="Profile preview"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
                e.target.className = "h-16 w-16 rounded-full bg-gray-200";
              }}
            />
          </div>
          <label className="flex-1">
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {employeeData.profileImage ? 'Change image' : 'Upload image'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG (Max 2MB)
                  </p>
                </div>
              )}
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Name */}
      <div className="relative">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <div className="relative">
          <input
            id="name"
            type="text"
            placeholder="Enter full name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={employeeData.name}
            onChange={(e) => setEmployeeData(prev => ({ ...prev, name: e.target.value }))}
            required
            disabled={isLoading}
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Email */}
      <div className="relative">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={employeeData.email}
            onChange={(e) => setEmployeeData(prev => ({ ...prev, email: e.target.value }))}
            required
            disabled={isLoading}
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Phone */}
      <div className="relative">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="relative">
          <input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={employeeData.phone}
            onChange={(e) => setEmployeeData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={isLoading}
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Role */}
      <div className="relative">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <div className="relative">
          <select
            id="role"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            value={employeeData.role}
            onChange={(e) => setEmployeeData(prev => ({ ...prev, role: e.target.value }))}
            disabled={isLoading}
          >
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Documents */}
      <div className="grid grid-cols-2 gap-4">
        {/* PAN Card */}
        <div className="relative">
          <label htmlFor="panCard" className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
          <div className="relative">
            <input
              id="panCard"
              type="text"
              placeholder="Enter PAN number"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={employeeData.panCard}
              onChange={(e) => setEmployeeData(prev => ({ ...prev, panCard: e.target.value }))}
              disabled={isLoading}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Aadhaar Card */}
        <div className="relative">
          <label htmlFor="aadhaarCard" className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Card</label>
          <div className="relative">
            <input
              id="aadhaarCard"
              type="text"
              placeholder="Enter Aadhaar number"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={employeeData.aadhaarCard}
              onChange={(e) => setEmployeeData(prev => ({ ...prev, aadhaarCard: e.target.value }))}
              disabled={isLoading}
            />
            <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditMode ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            isEditMode ? "Update Employee" : "Save Employee"
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;