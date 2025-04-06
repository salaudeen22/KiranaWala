const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../helper/cloudinaryConfig");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;
