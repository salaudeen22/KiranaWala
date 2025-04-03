const employeeService = require("../service/employeeService");
const { generateTemporaryPassword } = require("../utils/helpers");
const mongoose=require('mongoose');
const jwt = require("jsonwebtoken");

module.exports = {
  // Create employee
  async addEmployee(req, res) {
    try {
      const tempPassword = generateTemporaryPassword();
      console.log(tempPassword);
      const employeeData = { ...req.body, password: tempPassword };
      
      const employee = await employeeService.createEmployee(employeeData);
      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: employee
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get all employees
  async getEmployees(req, res) {
    try {
      const { page, limit, retailerId, role } = req.query;
      const employees = await employeeService.getAllEmployees({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        retailerId,
        role
      });
      
      res.status(200).json({
        success: true,
        data: employees
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get single employee
 async getEmployee(req, res) {
  try {

    console.log('Searching for employee ID:', req.params.id);
  
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const employee = await employeeService.getEmployeeById(req.params.id);
    console.log('Found employee:', employee);
    
    if (!employee) {
      console.log('Employee not found1');
      return res.status(404).json({ 
        success: false,
        message: "Employee not found",
        debug: {
          searchedId: req.params.id,
          validObjectId: mongoose.Types.ObjectId.isValid(req.params.id)
        }
      });
    }

  res.status(200).json({ success: true, data: employee });

 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
,

  // Update employee
  async updateEmployee(req, res) {
    try {
      const employee = await employeeService.updateEmployee(
        req.params.id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: employee
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete employee
  async deleteEmployee(req, res) {
    try {
      await employeeService.deleteEmployee(req.params.id);
      res.status(200).json({
        success: true,
        message: "Employee deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Employee login
 async loginEmployee (req, res, next)  {
    try {
        const { email, password } = req.body;

        const result = await employeeService.loginEmployee(email, password,res);
        console.log('Employee login result:', result);
        
       

        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        });
    }
  },

  // Reset password
  async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;
      const result = await employeeService.resetPassword(email, newPassword);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Record attendance
  async recordAttendance(req, res) {
    try {
      const employee = await employeeService.recordAttendance(
        req.params.id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        message: "Attendance recorded",
        data: employee
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get attendance
  async getAttendance(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const attendance = await employeeService.getAttendance(
        req.params.id,
        { startDate, endDate }
      );
      
      res.status(200).json({
        success: true,
        data: attendance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  
};