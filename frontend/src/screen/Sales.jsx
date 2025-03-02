import React from "react";

const Sales = () => {
  return (
    <div className="h-screen w-full ">
      <div className="DetailsPanel w-full bg-white shadow-lg rounded-xl p-2 flex flex-row gap-2">
      
        <div className="ventorDetails bg-red-300 p-4 rounded-lg shadow-md">
          <h1 className="text-lg font-bold text-gray-800">Shop Details</h1>
          <h1 className="text-md font-semibold mt-2">
            <b>Vendor Name:</b> Din Mart
          </h1>
          <h4 className="text-sm text-gray-700 mt-2">
            <b>Address: </b> 5, Babu Reddy Complex, Begur Main Road, Hongsandra,
            Bommanahalli, Bengaluru, Karnataka 560068
          </h4>
          <h4 className="text-sm text-gray-700 mt-2">
            <b>Login: </b> Admin
          </h4>
        </div>

        <div className="ventorAssistance w-full bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="InvoiceDetails flex justify-between text-sm font-medium text-gray-800">
            <h5>
              Invoice Number: <span className="font-semibold">1234</span>
            </h5>
            <h5>
              Date: <span className="font-semibold">12/2/2025</span>
            </h5>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col">
              <label
                htmlFor="barcode"
                className="text-sm font-medium text-gray-700"
              >
                Barcode
              </label>
              <input
                type="text"
                id="barcode"
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="ItemName"
                className="text-sm font-medium text-gray-700"
              >
                Item Name
              </label>
              <input
                type="text"
                id="ItemName"
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="SearchCode"
                className="text-sm font-medium text-gray-700"
              >
                Search Code
              </label>
              <input
                type="number"
                id="SearchCode"
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
