const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();

const Vendor = require("../../model/vendorSchema");
const sendEmail = require("../../helper/sendMail");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      ownerId,
      email,
      password,
      location,
      contactDetails,
      registrationDetails,
    } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor)
      return res.status(400).json({ message: "Vendor already exists" });

    const vendor = new Vendor({
      name,
      ownerId,
      email,
      password,
      location,
      contactDetails,
      registrationDetails,
    });

    await vendor.save();
    res.status(201).json({ message: "Vendor registered successfully", vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, vendor.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ vendorId: vendor._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.json({ message: "Vendor logged out successfully" });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    vendor.resetPasswordToken = resetToken;
    vendor.resetPasswordExpires = Date.now() + 3600000;
    await vendor.save();

    const resetUrl = `http://localhost:6565/api/vendors/auth/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Password Reset Request",
      `Click here to reset your password: ${resetUrl}`
    );

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const {newPassword}=req.body;
    console.log(newPassword);

    const vendor = await Vendor.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!vendor) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

  
    vendor.password = newPassword  ;
    vendor.resetPasswordToken = null;
    vendor.resetPasswordExpires = null;

    await vendor.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
