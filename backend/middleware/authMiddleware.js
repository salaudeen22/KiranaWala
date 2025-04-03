
const { verifyToken } = require("../utils/auth");
const Employee = require("../model/EmployeeSchema");
const Retailer = require("../model/vendorSchema");
const Owner = require("../model/OnwerSchema");
const Customer = require("../model/customerSchema");

const customerProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      
      const customer = await Customer.findById(decoded.id).select('-password');
      
      // Fix the check to use 'customer' instead of 'req.customer'
      if (!customer) {
        return res.status(401).json({ 
          success: false,
          message: 'Customer not found' 
        });
      }

      // Standardize user object format
      req.user = {
        id: customer._id,
        email: customer.email,
        role: 'customer',
        type: 'customer'
      };

      next();
    } catch (error) {
      console.error('Customer authentication error:', error);
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, please login again' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no authentication token' 
    });
  }
};

const ownerProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      
      req.owner = await Owner.findById(decoded.id).select('-password');
      
      if (!req.owner) {
        return res.status(401).json({ 
          success: false,
          message: 'Owner not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, please login again' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no authentication token' 
    });
  }
};

const ownerAuthorize = (...roles) => {
  return (req, res, next) => {
    if (!req.owner) {
      return res.status(403).json({
        success: false,
        message: 'Owner information missing'
      });
    }

    if (!roles.includes(req.owner.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Role ${req.owner.role} is not authorized` 
      });
    }
    next();
  };
};
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      console.log("Decoded Token:", decoded);

      // Check owner first
      const owner = await Owner.findById(decoded.id).select('-password');
      if (owner) {
        req.user = {
          id: owner._id,
          email: owner.email,
          role: 'owner',
          storesOwned: owner.storesOwned // Array of retailer IDs
        };
        return next();
      }

      // Check employee
      const employee = await Employee.findById(decoded.id).select('-password');
      if (employee) {
        if (!employee.retailerId) {
          return res.status(401).json({ 
            success: false, 
            message: 'Employee not assigned to any retailer' 
          });
        }

        const retailer = await Retailer.findById(employee.retailerId);
        if (!retailer) {
          return res.status(401).json({ 
            success: false, 
            message: 'Associated retailer not found' 
          });
        }

        req.user = {
          id: employee._id,
          email: employee.email,
          role: employee.role,
          retailerId: employee.retailerId,
          permissions: employee.permissions
        };

        return next();
      }

      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized - user not found' 
      });

    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, please login again' 
      });
    }
  }

  return res.status(401).json({ 
    success: false, 
    message: 'Not authorized, no authentication token' 
  });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Owners have full access
    if (req.user?.role === 'owner') return next();

    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: 'User information missing'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Role ${req.user.role} is not authorized` 
      });
    }
    next();
  };
};

module.exports = { 
  protect, 
  authorize,
  ownerProtect, 
  ownerAuthorize ,
  customerProtect
};