const Joi = require("joi");

// Employee creation validation
const employeeSchema = Joi.object({
  retailerId: Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  role: Joi.string().valid(
    "admin", "manager", "cashier", "inventory_staff", "delivery_coordinator"
  ).required(),
  panCard: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).required(),
  aadhaarCard: Joi.string().pattern(/^\d{4}\s?\d{4}\s?\d{4}$/).required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().pattern(/^\d{6}$/).required()
  }).optional(),
  employmentDetails: Joi.object({
    salary: Joi.number().min(0),
    bankDetails: Joi.object({
      accountNumber: Joi.string(),
      ifscCode: Joi.string(),
      bankName: Joi.string()
    })
  }).optional()
});

// Employee update validation
const employeeUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/),
  role: Joi.string().valid(
    "admin", "manager", "cashier", "inventory_staff", "delivery_coordinator"
  ),
  profileImage: Joi.string().uri(),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string().pattern(/^\d{6}$/)
  }),
  employmentDetails: Joi.object({
    isActive: Joi.boolean(),
    salary: Joi.number().min(0),
    bankDetails: Joi.object({
      accountNumber: Joi.string(),
      ifscCode: Joi.string(),
      bankName: Joi.string()
    })
  })
}).min(1);

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

// Reset password validation
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).required()
});

// Attendance validation
const attendanceSchema = Joi.object({
  status: Joi.string().valid("present", "absent", "half_day", "leave").required(),
  checkIn: Joi.date().iso(),
  checkOut: Joi.date().iso().min(Joi.ref("checkIn"))
});

module.exports = {
  validateEmployee: (req, res, next) => {
    const { error } = employeeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  },
  validateEmployeeUpdate: (req, res, next) => {
    const { error } = employeeUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  },
  validateLogin: (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  },
  validateResetPassword: (req, res, next) => {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  },
  validateAttendance: (req, res, next) => {
    const { error } = attendanceSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  }
};