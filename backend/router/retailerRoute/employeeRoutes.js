const express = require("express");
const mongoose = require("mongoose");

const Retailer = require("../../model/vendorSchema");
const Employee = require("../../model/EmployeeSchema");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    // console.log("Received Request:", req.body);
    const { name, email, phone, role, retailerId, panCard, aadhaarCard, profileImage } = req.body;

    if (!retailerId) {
      // console.log("❌ Missing Retailer ID!");
      return res.status(400).json({ message: "Retailer ID is required" });
    }

    // console.log("✅ Retailer ID received:", retailerId);
    const retailer = await Retailer.findById(retailerId);
    if (!retailer) {
      return res.status(404).json({ message: "Retailer not found" });
    }

    // ✅ Create new employee (let schema generate _id)
    const employee = new Employee({
      name,
      email,
      phone,
      role,
      retailerId: new mongoose.Types.ObjectId(retailerId),
      panCard,
      aadhaarCard,
      userImage:profileImage,
    });

    await employee.save();
    // console.log("✅ Employee created:", employee._id);

    // ✅ Add employee to retailer's list
    retailer.employees.push(employee._id);
    await retailer.save();

    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    console.error("❌ Error adding employee:", error);
    res.status(500).json({ message: "Error adding employee", error: error.message });
  }
});

// ✅ Get All Employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().populate("retailerId", "name email");
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
});

// ✅ Get Employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("retailerId", "name email");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error: error.message });
  }
});

// ✅ Update Employee
router.put("/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee updated successfully", updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error: error.message });
  }
});

// ✅ Delete Employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Retailer.updateOne({ employees: employee._id }, { $pull: { employees: employee._id } });

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
});

module.exports = router;
