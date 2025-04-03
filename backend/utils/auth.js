const jwt = require('jsonwebtoken');
require('dotenv').config();

const signToken = (id,role,retailerId) => {
  return jwt.sign({ id,role ,retailerId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id,res.role,user.retailerId);
  // console.log("User:", user);
  // console.log("Token:", token);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user
    }
  });
};

module.exports = {
  signToken,
  verifyToken,
  createSendToken
};