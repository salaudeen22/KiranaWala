const express = require("express");
const router = express.Router();
const employeeController = require("../../controller/employeeController");
const { protect, authorize } = require("../../middleware/authMiddleware");

// Public routes
router.post("/login", employeeController.loginEmployee);
router.post("/reset-password", employeeController.resetPassword);

// Protected routes
router.use(protect); // Applies to all routes below

// Employee creation (Owner/Admin only)
router.post("/", 
  authorize("owner", "admin"), 
  employeeController.addEmployee
);

// Employee listing (Owner/Admin/Manager)
router.get("/", 
  authorize("owner", "admin", "manager"), 
  employeeController.getEmployees
);

// Single employee access
router.get("/:id", 
  authorize("owner", "admin", "manager", "cashier", "inventory_staff", "delivery_coordinator"),
  employeeController.getEmployee
);

// Employee modification (Owner/Admin only)
router.put("/:id", 
  authorize("owner", "admin"), 
  employeeController.updateEmployee
);

router.delete("/:id", 
  authorize("owner", "admin"), 
  employeeController.deleteEmployee
);

// Attendance routes (Manager+)
router.post("/:id/attendance", 
  authorize("owner", "admin", "manager"), 
  employeeController.recordAttendance
);

router.get("/:id/attendance", 
  authorize("owner", "admin", "manager"), 
  employeeController.getAttendance
);

module.exports = router;