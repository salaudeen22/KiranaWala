import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiFileText, 
  FiChevronLeft, FiChevronRight, FiLock, FiEye, FiEyeOff 
} from "react-icons/fi";
import { FaUserTie, FaCheckCircle } from "react-icons/fa";
import Swal from 'sweetalert2';

const OwnerSignUp = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Passwords do not match!",
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch("http://localhost:6565/api/owners/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          address: {
            street,
            city,
            state,
            pincode,
          },
          panNumber,
          aadhaarNumber,
        }),
      });
      console.log(response);
  
      const json = await response.json();
      console.log(json);
  
      if (response.status === 201) {
        setSuccess(true);
  
        // ✅ SweetAlert Success
        await Swal.fire({
          title: "Registration Successful!",
          html: `Your <b>Owner ID</b> is: <code>${json.data.user.id}</code><br><br><b>Please save this ID for future use.</b>`,
          icon: "success",
          confirmButtonText: "Save",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
  
        navigate("/signup");
      } 
    } catch (error) {
      console.error("Sign Up Error:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const progress = (step / 2) * 100;

  const nextStep = () => {
    // Validate password match before proceeding to next step
    if (step === 1 && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-400 to-indigo-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container flex flex-col md:flex-row items-center justify-center bg-white shadow-2xl rounded-xl overflow-hidden w-full max-w-4xl"
      >
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-purple-500 to-indigo-700 justify-center items-center p-8">
          <div className="text-center">
            <FaUserTie className="text-white text-6xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">KiranaWalla</h1>
            <p className="text-purple-100 text-lg">Owner Registration</p>
            
            {/* Step Indicators */}
            <div className="mt-8 space-y-4 text-left">
              <div className={`flex items-center ${step >= 1 ? 'text-white' : 'text-purple-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= 1 ? 'bg-white text-purple-600' : 'border-2 border-purple-200'}`}>
                  {step > 1 ? <FaCheckCircle /> : '1'}
                </div>
                <span>Personal Information</span>
              </div>
              
              <div className={`flex items-center ${step >= 2 ? 'text-white' : 'text-purple-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= 2 ? 'bg-white text-purple-600' : 'border-2 border-purple-200'}`}>
                  2
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
              {step === 1 && 'Create Owner Account'}
              {step === 2 && 'Legal Documents'}
            </h2>
            <p className="text-gray-600">
              {step === 1 && 'Fill in your personal information to get started'}
              {step === 2 && 'Upload your identification documents'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div 
                className="h-2 rounded-full bg-purple-500" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Step {step} of 2</span>
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
                      <label className="text-gray-700 font-medium">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="Your full name"
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="Create a password"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Confirm Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="Confirm your password"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Phone Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="9876543210"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-gray-700 font-medium">Street</label>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            placeholder="Street address"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-700 font-medium">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="City"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-gray-700 font-medium">State</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="State"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-700 font-medium">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="560001"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">PAN Number</label>
                      <div className="relative">
                        <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="ABCDE1234F"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Aadhaar Number</label>
                      <div className="relative">
                        <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={aadhaarNumber}
                          onChange={(e) => setAadhaarNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          placeholder="1234 5678 9012"
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
                {step < 2 ? (
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
                      className="flex items-center px-5 py-2.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
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
                    className={`flex items-center px-6 py-3 text-white rounded-lg transition ${isSubmitting || success ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-700'}`}
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

export default OwnerSignUp;