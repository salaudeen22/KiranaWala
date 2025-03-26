import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiMail, FiLock, FiMapPin, FiPhone, 
  FiFileText, FiChevronLeft, FiChevronRight, FiTruck 
} from "react-icons/fi";
import { FaStore, FaCheckCircle } from "react-icons/fa";

const VendorSignUp = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [selfDelivery, setSelfDelivery] = useState(false);
  const [partneredDelivery, setPartneredDelivery] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        "http://localhost:6565/api/vendor/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            ownerId,
            email,
            password,
            location: { address },
            phone,
            registrationDetails: { gstNumber, fssaiNumber, businessLicense },
            deliveryOptions: { selfDelivery, partneredDelivery },
          }),
        }
      );
      
      const json = await response.json();
      
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        alert("Error: " + json.message);
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / 3) * 100;

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 to-indigo-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container flex flex-col md:flex-row items-center justify-center bg-white shadow-2xl rounded-xl overflow-hidden w-full max-w-5xl"
      >
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-500 to-indigo-700 justify-center items-center p-8">
          <div className="text-center">
            <FaStore className="text-white text-6xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">KiranaWalla</h1>
            <p className="text-blue-100 text-lg">Vendor Registration Portal</p>
            
            {/* Step Indicators */}
            <div className="mt-8 space-y-4 text-left">
              <div className={`flex items-center ${step >= 1 ? 'text-white' : 'text-blue-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= 1 ? 'bg-white text-blue-600' : 'border-2 border-blue-200'}`}>
                  {step > 1 ? <FaCheckCircle /> : '1'}
                </div>
                <span>Account Information</span>
              </div>
              
              <div className={`flex items-center ${step >= 2 ? 'text-white' : 'text-blue-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= 2 ? 'bg-white text-blue-600' : 'border-2 border-blue-200'}`}>
                  {step > 2 ? <FaCheckCircle /> : '2'}
                </div>
                <span>Business Details</span>
              </div>
              
              <div className={`flex items-center ${step >= 3 ? 'text-white' : 'text-blue-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= 3 ? 'bg-white text-blue-600' : 'border-2 border-blue-200'}`}>
                  3
                </div>
                <span>Legal Documents</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {step === 1 && 'Create Vendor Account'}
              {step === 2 && 'Business Information'}
              {step === 3 && 'Legal Documents'}
            </h2>
            <p className="text-gray-600">
              {step === 1 && 'Fill in your basic information to get started'}
              {step === 2 && 'Tell us about your business'}
              {step === 3 && 'Upload your business documents'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div 
                className="h-2 rounded-full bg-blue-500" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Step {step} of 3</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Vendor Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Your store name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Owner ID</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={ownerId}
                          onChange={(e) => setOwnerId(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Your owner ID"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Address</label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-4 text-gray-400" />
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Full business address"
                          rows={3}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Phone</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Contact number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium">Delivery Options</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 border rounded-lg cursor-pointer transition ${selfDelivery ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                          onClick={() => setSelfDelivery(!selfDelivery)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selfDelivery}
                              onChange={() => {}}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <div className="ml-3">
                              <h3 className="font-medium">Self Delivery</h3>
                              <p className="text-sm text-gray-600">We'll handle our own deliveries</p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 border rounded-lg cursor-pointer transition ${partneredDelivery ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                          onClick={() => setPartneredDelivery(!partneredDelivery)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={partneredDelivery}
                              onChange={() => {}}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <div className="ml-3">
                              <h3 className="font-medium">Partner Delivery</h3>
                              <p className="text-sm text-gray-600">Use KiranaWalla delivery partners</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">GST Number (Optional)</label>
                      <div className="relative">
                        <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="22AAAAA0000A1Z5"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">FSSAI License Number</label>
                      <div className="relative">
                        <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={fssaiNumber}
                          onChange={(e) => setFssaiNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="11223344556677"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Business License Number</label>
                      <div className="relative">
                        <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={businessLicense}
                          onChange={(e) => setBusinessLicense(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="BL-12345678"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <div>
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <FiChevronLeft className="mr-2" />
                    Back
                  </motion.button>
                )}
              </div>

              <div className="flex space-x-3">
                {step < 3 ? (
                  <>
                    {step === 1 && (
                      <motion.button
                        type="button"
                        onClick={() => navigate("/login")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        Already Registered? Login
                      </motion.button>
                    )}
                    
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                      Next
                      <FiChevronRight className="ml-2" />
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || success}
                    whileHover={{ scale: isSubmitting || success ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting || success ? 1 : 0.95 }}
                    className={`flex items-center px-6 py-3 text-white rounded-lg transition ${isSubmitting || success ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : success ? (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Success! Redirecting...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorSignUp;