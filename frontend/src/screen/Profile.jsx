import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { FiUser, FiMail, FiPhone, FiCamera, FiSave } from "react-icons/fi";
import { motion } from "framer-motion";

const EditProfile = ({ handleUpdateProfile }) => {
  const { userData } = useUser();
  const [updatedProfile, setUpdatedProfile] = useState({ ...userData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(userData.profilePicture || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUpdatedProfile({
          ...updatedProfile,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Uncomment this for real API call
      /*
      const response = await fetch("http://localhost:6565/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      */

      alert("Profile updated successfully!");
      handleUpdateProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Edit Profile</h2>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center -mt-12 mb-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                    e.target.className = "h-full w-full object-cover bg-gray-200";
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="text-gray-400 text-3xl" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-600 transition-colors">
              <FiCamera className="text-lg" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
                disabled={isSubmitting}
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                name="name"
                value={updatedProfile.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                name="email"
                value={updatedProfile.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Phone Field */}
          <div className="relative">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                name="phone"
                value={updatedProfile.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              } transition-colors`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProfile;