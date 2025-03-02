const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dt2g1igas",
  api_key: process.env.CLOUDINARY_API_KEY || "443497617149751",
  api_secret: process.env.CLOUDINARY_API_SECRET || "HmS87qOwEXfIoECQuuUQk7cWfyE",
});

module.exports = cloudinary;
