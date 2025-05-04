import React, { useState } from 'react';
import Swal from 'sweetalert2';

const BulkUploadModal = ({ setIsModalOpen, onProductsUploaded }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Ensure the file is being set correctly
    console.log("Selected file:", e.target.files[0]); // Debugging log
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire("Error", "Please select a file to upload.", "error");
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
      Swal.fire("Error", "You are not logged in. Please log in and try again.", "error");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:6565/api/products/bulk-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload products');
      }

      Swal.fire("Success", "Products uploaded successfully!", "success");
      onProductsUploaded();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error uploading products:', error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDownloadTemplate = () => {
    window.open('http://localhost:6565/api/products/bulk-upload/template', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Bulk Upload Products</h2>
        <button
          onClick={handleDownloadTemplate}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Download Template
        </button>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
          accept=".xlsx, .xls" // Ensure only Excel files are selectable
        />
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
