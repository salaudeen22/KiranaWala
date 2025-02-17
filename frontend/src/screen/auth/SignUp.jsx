import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
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
      console.log(json);
      if (response.status === 200) {
        navigate("/login");
      } else {
        alert("Error: " + json.message);
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="container flex flex-col md:flex-row items-center justify-center bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
          <h1 className="text-4xl font-extrabold text-blue-600">KiranaWalla</h1>
        </div>

        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Sign Up for Vendor
          </h2>

          <div className="w-full mb-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase">
                  Step {step} of 3
                </span>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div className="flex justify-between w-full">
                  <div className="flex justify-start">
                    <div className="w-1/3 bg-gray-200 h-1 rounded-full">
                      <div
                        className="h-1 rounded-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {step === 1 && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="Vendor Name"
                  required
                />
                <input
                  type="text"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="Owner ID"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="Email"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="Password"
                  required
                />
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="Address"
                  required
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="Phone"
                  required
                />
                <div className="mt-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selfDelivery}
                      onChange={() => setSelfDelivery(!selfDelivery)}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Self Delivery</span>
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="checkbox"
                      checked={partneredDelivery}
                      onChange={() => setPartneredDelivery(!partneredDelivery)}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Partnered Delivery</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="GST Number"
                />
                <input
                  type="text"
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="FSSAI Number"
                  required
                />
                <input
                  type="text"
                  value={businessLicense}
                  onChange={(e) => setBusinessLicense(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-1"
                  placeholder="Business License"
                  required
                />
              </div>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <>
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                  >
                    Next
                  </button>
                  {step == 1 && (
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                    >
                      Login
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                >
                  Sign Up
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorSignUp;
