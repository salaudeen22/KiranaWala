import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, FiMail, FiPhone, FiEdit, FiSave, 
  FiLock, FiHome, FiMapPin, FiTrash2, FiPlus, 
  FiHeart, FiX, FiKey, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-modal';
import Swal from "sweetalert2";

// Make sure to bind modal to your appElement
Modal.setAppElement('#root');

function Profile() {
  const { user, updateProfile, loading } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [addressEditMode, setAddressEditMode] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('http://localhost:6565/api/customers/Alladdress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
  
      if (response.ok) {
        setAddresses(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch addresses');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile information has been updated successfully.",
        });
        setEditMode(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "Unable to update profile.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = addressEditMode ? 
        `http://localhost:6565/api/customers/address/${addressEditMode}` : 
        'http://localhost:6565/api/customers/address';
      
      const method = addressEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(addressForm)
      });

      const data = await response.json();
        
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save address');
      }

      setSuccess(`Address ${addressEditMode ? 'updated' : 'added'} successfully!`);
      fetchAddresses();
      resetAddressForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const response = await fetch(`http://localhost:6565/api/customers/address/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete address');
      }

      setSuccess('Address deleted successfully!');
      fetchAddresses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const editAddress = (address) => {
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    });
    setAddressEditMode(address._id);
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setAddressEditMode(null);
    setShowAddressForm(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.put(
        "http://localhost:6565/api/customers/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPasswordMessage(response.data.message);
      // Clear form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setPasswordMessage("");
        setIsPasswordModalOpen(false);
      }, 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (!user) return <div className="text-center py-8">Please login to view profile</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-green-100">Manage your account information and preferences</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
              <FiAlertCircle className="mr-2" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center">
              <FiCheck className="mr-2" />
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
                
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FiKey className="mr-2" />
                    Change Password
                  </button>
                </div>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delivery Addresses</h2>
              <button 
                onClick={() => {
                  resetAddressForm();
                  setShowAddressForm(true);
                }}
                className="flex items-center text-green-600 hover:text-green-700"
              >
                <FiPlus className="mr-1" /> Add New Address
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">
                  {addressEditMode ? 'Edit Address' : 'Add New Address'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {addressEditMode ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.length > 0 ? (
                addresses.map(address => (
                  <div key={address._id} className={`border rounded-lg p-4 ${address.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center mb-2">
                        <FiMapPin className={`mr-2 ${address.isDefault ? 'text-green-600' : 'text-gray-500'}`} />
                        <h3 className="font-medium">
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                              Default
                            </span>
                          )}
                          {address.street.substring(0, 20)}...
                        </h3>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => editAddress(address)}
                          className="text-gray-500 hover:text-green-600"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button 
                          onClick={() => deleteAddress(address._id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {address.street}, {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-4 text-gray-500">
                  No addresses found. Add your first delivery address.
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
            <div className="space-y-3">
              <Link to="/wishlist" className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center">
                  <FiHeart className="text-gray-500 mr-3" />
                  <span>View Wishlist</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onRequestClose={() => setIsPasswordModalOpen(false)}
        contentLabel="Change Password"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
            <button 
              onClick={() => setIsPasswordModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          {passwordMessage ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg mb-4 flex items-center">
              <FiCheck className="mr-2" />
              {passwordMessage}
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4 flex items-center">
                  <FiAlertCircle className="mr-2" />
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Modal Styles */}
      <style jsx global>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          margin-right: -50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 0;
          border-radius: 0.5rem;
          outline: none;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
}

export default Profile;