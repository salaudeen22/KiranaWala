const express = require("express");
const router = express.Router();
const employeeController = require("../../controller/employeeController");
const { validateEmployee } = require("../../middleware/employeeValidator");

//  Routes
router.post("/add", validateEmployee, employeeController.addEmployee);
router.get("/", employeeController.getEmployees);
router.get("/:id", employeeController.getEmployee);
router.put("/:id", validateEmployee, employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
