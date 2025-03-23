const { body, validationResult } = require("express-validator");

const validateEmployee = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").isMobilePhone().withMessage("Valid phone number is required"),
  body("role").notEmpty().withMessage("Role is required"),
  body("retailerId").notEmpty().withMessage("Retailer ID is required"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateEmployee };
