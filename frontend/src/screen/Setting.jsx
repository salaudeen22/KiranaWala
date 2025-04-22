import { useUser } from "../context/userContext";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Setting() {
  const { user, updateUser } = useUser();
  const [toggle, setToggle] = useState({
    general: true,
    timing: false,
    delivery: false,
  });
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        settings: { ...user.settings },
        businessHours: { ...user.businessHours },
        deliveryOptions: { ...user.deliveryOptions },
        serviceAreas: [...user.serviceAreas]
      });
    }
  }, [user]);

  const handleToggle = (section) => {
    setToggle({
      general: section === 'general',
      timing: section === 'timing',
      delivery: section === 'delivery',
    });
  };

  const handleChange = (e, section, field, isNested = false, nestedField = null) => {
    const { value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const newData = { ...prev };
      
      if (isNested && nestedField) {
        newData[section][field][nestedField] = type === 'number' ? Number(inputValue) : inputValue;
      } else if (section && field) {
        newData[section][field] = type === 'number' ? Number(inputValue) : inputValue;
      }
      
      return newData;
    });
  };

  const handleServiceAreaChange = (index, field, value) => {
    setFormData(prev => {
      const newServiceAreas = [...prev.serviceAreas];
      newServiceAreas[index] = {
        ...newServiceAreas[index],
        [field]: typeof value === 'string' && !isNaN(value) ? Number(value) : value
      };
      return { ...prev, serviceAreas: newServiceAreas };
    });
  };

  const handleAddServiceArea = () => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: [
        ...prev.serviceAreas,
        {
          pincode: '',
          serviceAvailable: true,
          deliveryFee: 0,
          minOrderAmount: 0,
          estimatedDeliveryTime: 0,
        },
      ],
    }));
  };

  const handleRemoveServiceArea = (index) => {
    setFormData(prev => {
      const newServiceAreas = [...prev.serviceAreas];
      newServiceAreas.splice(index, 1);
      return { ...prev, serviceAreas: newServiceAreas };
    });
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('http://localhost:6565/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Settings Updated',
          text: 'Your settings have been saved successfully.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error Saving Settings',
          text: 'Failed to save settings. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to the server. Please try again later.',
      });
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    
    setIsLoading(true);
    setSaveStatus(null);
    
    try {
      const response = await fetch('http://localhost:6565/api/retailers/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Settings saved successfully:", data);
      setSaveStatus({ success: true, message: 'Settings saved successfully!' });
      
      // Update user context with new data
      if (updateUser) {
        updateUser(data.data); // Assuming the API returns the updated user object
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus({ success: false, message: 'Failed to save settings. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !formData) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex flex-col items-center h-full p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Store Settings</h1>
        
        {/* Save Status Notification */}
        {saveStatus && (
          <div className={`w-full mb-4 p-3 rounded-lg ${saveStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {saveStatus.message}
          </div>
        )}
        
        <div className="w-full mb-6">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg w-full transition ${toggle.general ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => handleToggle('general')}
            >
              General Settings
            </button>
            <button
              className={`px-4 py-2 rounded-lg w-full transition ${toggle.timing ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => handleToggle('timing')}
            >
              Timing Settings
            </button>
            <button
              className={`px-4 py-2 rounded-lg w-full transition ${toggle.delivery ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => handleToggle('delivery')}
            >
              Delivery Settings
            </button>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl shadow-md p-6">
          {/* General Settings */}
          {toggle.general && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto Accept Orders</h3>
                  <p className="text-sm text-gray-500">Automatically accept incoming orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.settings.autoAcceptOrders}
                    onChange={(e) => handleChange(e, 'settings', 'autoAcceptOrders')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Low Stock Notification</h3>
                  <p className="text-sm text-gray-500">Get notified when stock is low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.settings.notifyLowStock}
                    onChange={(e) => handleChange(e, 'settings', 'notifyLowStock')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Low Stock Threshold</h3>
                  <p className="text-sm text-gray-500">Minimum quantity before low stock alert</p>
                </div>
                <input 
                  type="number" 
                  value={formData.settings.lowStockThreshold}
                  onChange={(e) => handleChange(e, 'settings', 'lowStockThreshold')}
                  className="w-20 px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Order Confirmation SMS</h3>
                  <p className="text-sm text-gray-500">Send SMS when order is confirmed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.settings.orderConfirmationSMS}
                    onChange={(e) => handleChange(e, 'settings', 'orderConfirmationSMS')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* Timing Settings */}
          {toggle.timing && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
              
              <div>
                <h3 className="font-medium mb-2">Business Days</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={day.toLowerCase()} 
                        className="mr-2 h-4 w-4"
                        checked={!formData.businessHours.holidays.includes(day.toLowerCase())}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setFormData(prev => {
                            const newHolidays = isChecked 
                              ? prev.businessHours.holidays.filter(d => d !== day.toLowerCase())
                              : [...prev.businessHours.holidays, day.toLowerCase()];
                            return {
                              ...prev,
                              businessHours: {
                                ...prev.businessHours,
                                holidays: newHolidays
                              }
                            };
                          });
                        }}
                      />
                      <label htmlFor={day.toLowerCase()}>{day}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Opening Hours</h3>
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Open Time</label>
                    <input 
                      type="time" 
                      className="border rounded-lg px-3 py-2" 
                      value={formData.businessHours.openTime || "09:00"}
                      onChange={(e) => handleChange(e, 'businessHours', 'openTime')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Close Time</label>
                    <input 
                      type="time" 
                      className="border rounded-lg px-3 py-2" 
                      value={formData.businessHours.closeTime || "21:00"}
                      onChange={(e) => handleChange(e, 'businessHours', 'closeTime')}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Settings */}
          {toggle.delivery && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Self Delivery</h3>
                  <p className="text-sm text-gray-500">Handle deliveries with your own staff</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.deliveryOptions.selfDelivery}
                    onChange={(e) => handleChange(e, 'deliveryOptions', 'selfDelivery')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Partnered Delivery</h3>
                  <p className="text-sm text-gray-500">Use third-party delivery services</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.deliveryOptions.partneredDelivery}
                    onChange={(e) => handleChange(e, 'deliveryOptions', 'partneredDelivery')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              {formData.deliveryOptions.partneredDelivery && (
                <div>
                  <h3 className="font-medium mb-2">Delivery Partners</h3>
                  <div className="space-y-2">
                    {formData.deliveryOptions.deliveryPartners.length > 0 ? (
                      formData.deliveryOptions.deliveryPartners.map(partner => (
                        <div key={partner} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={partner} 
                            className="mr-2" 
                            checked={true} // Assuming all listed partners are active
                            onChange={() => {
                              // Implement partner toggle logic if needed
                            }}
                          />
                          <label htmlFor={partner}>{partner}</label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No delivery partners added yet</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Service Areas</h3>
                <div className="space-y-4">
                  {formData.serviceAreas.map((area, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <input
                          type="text"
                          placeholder="Enter Pincode"
                          value={area.pincode}
                          onChange={(e) => handleServiceAreaChange(index, 'pincode', e.target.value)}
                          className="w-1/2 px-3 py-2 border rounded-lg"
                        />
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleRemoveServiceArea(index)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Delivery Fee</label>
                          <input 
                            type="number" 
                            value={area.deliveryFee} 
                            onChange={(e) => handleServiceAreaChange(index, 'deliveryFee', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Min Order Amount</label>
                          <input 
                            type="number" 
                            value={area.minOrderAmount} 
                            onChange={(e) => handleServiceAreaChange(index, 'minOrderAmount', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Est. Delivery Time (min)</label>
                          <input 
                            type="number" 
                            value={area.estimatedDeliveryTime} 
                            onChange={(e) => handleServiceAreaChange(index, 'estimatedDeliveryTime', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    onClick={handleAddServiceArea}
                  >
                    Add Service Area
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button 
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleSaveSettings}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;