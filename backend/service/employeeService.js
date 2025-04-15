const Employee = require("../model/EmployeeSchema");
const Retailer = require("../model/vendorSchema");
const { generateAuthToken, createSendToken } = require("../utils/auth");
const Email = require('../utils/sendMail'); 
const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");
const vendorSchema = require("../model/vendorSchema");

class EmployeeService {



  // Create new employee
  // EmployeeService.js
  async createEmployee(employeeData) {
    const session = await mongoose.startSession();
    console.log("Started creating the user");

    // console.log("Employee Image",employeeData.profileImage)
    session.startTransaction();
    // console.log("employye1");
    // console.log(employeeData);
    try {
      // 1. Verify retailer exists
      const retailer = await Retailer.findById(employeeData.retailerId).session(
        session
      );
      if (!retailer) throw new Error("Retailer not found");

      // 2. Create and save employee
      const employee = new Employee(employeeData);
      // console.log(employee);
      await employee.save({ session });

      console.log("retailerDate"+retailer);

      // 3. Add to retailer's employees array
      retailer.employees.push(employee._id);
      await retailer.save({ session });

      const url = `http://localhost:5173/login`; // You might want to set this in your env
      await new Email(employee, url).welcomeEmployee();



      await session.commitTransaction();
      return employee;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get all employees with pagination
  async getAllEmployees({ retailerId, role }) {
    // console.log("Retailer id"+retailerId);
    const vendor = await vendorSchema.findById(retailerId).populate('employees');
    // console.log("Vendor"+vendor);
  
    if (!vendor) {
      throw new Error('Vendor not found');
    }
  
    let employees = vendor.employees;
  
  
  
    return employees;
  }

  // Get employee by ID
  async getEmployeeById(id) {
    return await Employee.findById(id)
      .select("-password -__v")
      .populate("retailerId", "name displayName location.address");
  }

  // Update employee
  async updateEmployee(id, updateData) {
    const allowedUpdates = [
      "name",
      "phone",
      "role",
      "permissions",
      "profileImage",
      "address",
      "emergencyContact",
      "employmentDetails",
    ];

    const updates = Object.keys(updateData);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) throw new Error("Invalid updates!");

    const employee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!employee) throw new Error("Employee not found");
    return employee;
  }

  // Delete employee
  async deleteEmployee(id) {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) throw new Error("Employee not found");

    await Retailer.updateOne(
      { _id: employee.retailerId },
      { $pull: { employees: employee._id } }
    );

    return employee;
  }

  // Employee login
  async loginEmployee(email, password,res) {
    // 1. Check if email and password exist
    console.log("Email:", email);
    console.log("Password:", password);
    if (!email || !password) {
        throw new Error('Please provide email and password');
    }

    // 2. Find employee with password field
    const employee = await Employee.findOne({ email })
        .select('+password +employmentDetails.isActive')
     ;

        console.log("Employee:", employee);

    // 3. Check if employee exists and password is correct
    if (!employee || !(await employee.comparePassword(password))) {
        throw new Error('Incorrect email or password');
    }

    // 4. Check if account is active
    if (!employee.employmentDetails.isActive) {
        throw new Error('Account deactivated. Please contact admin.');
    }

    // 5. Update last login
    employee.lastLogin = Date.now();
    await employee.save();

    // 6. Generate token
    const token = createSendToken(employee, 200,res);
    console.log("Token:", token);
    // 7. Return formatted response
  
}
  // Reset password
  async resetPassword(email, newPassword) {
    const employee = await Employee.findOne({ email });
    if (!employee) throw new Error("Employee not found");

    employee.password = newPassword;
    await employee.save();

    return { message: "Password updated successfully" };
  }

  // Record attendance
  async recordAttendance(employeeId, { status, checkIn, checkOut }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await Employee.findOne({
      _id: employeeId,
      "attendance.date": today,
    });

    if (existingRecord) {
      return await Employee.findOneAndUpdate(
        { _id: employeeId, "attendance.date": today },
        { $set: { "attendance.$.status": status } },
        { new: true }
      );
    }

    return await Employee.findByIdAndUpdate(
      employeeId,
      {
        $push: {
          attendance: {
            date: today,
            status,
            checkIn,
            checkOut,
          },
        },
      },
      { new: true }
    );
  }

  // Get employee attendance
  async getAttendance(employeeId, { startDate, endDate }) {
    const employee = await Employee.findById(employeeId).select(
      "attendance name employeeId"
    );

    if (!employee) throw new Error("Employee not found");

    if (startDate && endDate) {
      const filteredAttendance = employee.attendance.filter((record) => {
        return (
          record.date >= new Date(startDate) && record.date <= new Date(endDate)
        );
      });
      return { ...employee.toObject(), attendance: filteredAttendance };
    }

    return employee;
  }
}

module.exports = new EmployeeService();
