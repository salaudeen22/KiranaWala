const jwt = require('jsonwebtoken');
require('dotenv').config();

const signToken = (id, role, retailerId) => {
  return jwt.sign({ id, role, retailerId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role, user.retailerId);
  if(user.role=="owner")
  {
    res.status(statusCode).json({
      status: 'success',
      token,
      retailerId: user._id, 
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  }
  
  return res.status(statusCode).json({
    status: 'success',
    token,
    retailerId: user.retailerId ,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.contact?.email || user.email,
        role: user.role
      }
    }
  });
};

module.exports = { signToken, verifyToken, createSendToken };