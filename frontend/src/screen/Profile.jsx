import React, { useState } from "react";
import { useUser } from "../context/userContext";


const EditProfile = ({ handleUpdateProfile }) => {
  const { userData } = useUser();
  const [updatedProfile, setUpdatedProfile] = useState({ ...userData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await fetch("http://localhost:6565/api/user/profile", {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("token")}`, 
    //     },
    //     body: JSON.stringify(updatedProfile),
    //   });

    //   if (response.ok) {
    //     alert("Profile updated successfully!");
    //     handleUpdateProfile(); 
    //   } else {
    //     alert("Error updating profile.");
    //   }
    // } catch (error) {
    //   console.error("Error updating profile:", error);
    //   alert("Error updating profile.");
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={updatedProfile.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={updatedProfile.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={updatedProfile.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <label htmlFor="profilePicture">Profile Picture URL</label>
          <input
            id="profilePicture"
            type="text"
            name="profilePicture"
            value={updatedProfile.profilePicture || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          {updatedProfile.profilePicture && (
            <img
              src={updatedProfile.profilePicture}
              alt="Profile Preview"
              className="mt-2 w-full h-40 object-cover rounded-lg border"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
