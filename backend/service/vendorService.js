const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Vendor = require("../model/vendorSchema");

const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const generateToken = (vendorId) => {
  return jwt.sign({ vendorId }, JWT_SECRET, { expiresIn: "7d" });
};

const createVendor = async (vendorData) => {
  vendorData.password = await hashPassword(vendorData.password);
  const vendor = new Vendor(vendorData);
  await vendor.save();
  return vendor;
};

const comparePasswords = async (inputPassword, storedPassword) => {
  return bcrypt.compare(inputPassword, storedPassword);
};

const generateResetToken = async (vendor) => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  vendor.resetPasswordToken = resetToken;
  vendor.resetPasswordExpires = Date.now() + 3600000;
  await vendor.save();
  return resetToken;
};

module.exports = {
  createVendor,
  generateToken,
  comparePasswords,
  generateResetToken
};
