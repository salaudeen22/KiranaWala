import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiEdit, FiSave, FiLock, FiHome, FiMapPin } from 'react-icons/fi';

function Profile() {
  const { user, updateProfile, loading } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const result = await updateProfile(formData);
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (!user) return <div className="text-center py-8">Please login to view profile</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-green-100">Manage your KiranWalla account</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg">
              {success}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl">
                    <FiUser size={40} />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-center">{user.name}</h2>
                <p className="text-gray-600 text-center">{user.email}</p>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                {!editMode ? (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-green-600 hover:text-green-700"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                ) : (
                  <button 
                    onClick={() => setEditMode(false)}
                    className="flex items-center text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    ) : (
                      <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <FiUser className="text-gray-500 mr-2" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    ) : (
                      <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <FiMail className="text-gray-500 mr-2" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    ) : (
                      <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <FiPhone className="text-gray-500 mr-2" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>

                  {editMode && (
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="flex items-center justify-center w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <FiSave className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Account Security</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center">
                  <FiLock className="text-gray-500 mr-3" />
                  <span>Change Password</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;