const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const Vendor = require("../../model/vendorSchema"); 
const { createVendor, generateToken, comparePasswords, generateResetToken } = require("../../service/vendorService");

//  REGISTER VENDOR
router.post("/register", async (req, res) => {
  try {
    const existingVendor = await Vendor.findOne({ email: req.body.email });
    if (existingVendor) return res.status(400).json({ message: "Vendor already exists" });

    const vendor = await createVendor(req.body);
    res.status(201).json({ message: "Vendor registered successfully", vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  LOGIN VENDOR
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await comparePasswords(password, vendor.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(vendor._id);
    res.json({ token, vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔹 FETCH PROFILE DETAILS
router.get("/profileDetails", authMiddleware, async (req, res) => {
  try {
    const details = await Vendor.findById(req.user.vendorId).select("-password");
    if (!details) return res.status(404).json({ message: "User not found" });
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔹 LOGOUT VENDOR
router.post("/logout", (req, res) => {
  res.json({ message: "Vendor logged out successfully" });
});

//  FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ email: req.body.email });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const resetToken = await generateResetToken(vendor);
    await sendResetEmail(req.body.email, resetToken);

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  RESET PASSWORD
router.post("/reset/:token", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!vendor) return res.status(400).json({ message: "Invalid or expired token" });

    vendor.password = await hashPassword(req.body.newPassword);
    vendor.resetPasswordToken = null;
    vendor.resetPasswordExpires = null;
    await vendor.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
