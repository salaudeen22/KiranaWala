const Employee = require("../model/EmployeeSchema");
const Retailer = require("../model/vendorSchema");
const { generateAuthToken, createSendToken } = require("../utils/auth");
const { sendWelcomeEmail } = require("../utils/sendMail");
const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");

class EmployeeService {
  // Create new employee
  // EmployeeService.js
  async createEmployee(employeeData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Verify retailer exists
      const retailer = await Retailer.findById(employeeData.retailerId).session(
        session
      );
      if (!retailer) throw new Error("Retailer not found");

      // 2. Create and save employee
      const employee = new Employee(employeeData);
      await employee.save({ session });

      // 3. Add to retailer's employees array
      retailer.employees.push(employee._id);
      await retailer.save({ session });

      // 4. Send welcome email (fire and forget)
      // sendWelcomeEmail(
      //   employee.email,
      //   "Your Employee Account",
      //   `Credentials:\nEmail: ${employee.email}\nPassword: ${employeeData.password}`
      // ).catch(console.error);

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
  async getAllEmployees({ page = 1, limit = 10, retailerId, role }) {
    const query = {};
    if (retailerId) query.retailerId = retailerId;
    if (role) query.role = role;

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "-password -__v",
      populate: {
        path: "retailerId",
        select: "name displayName",
      },
    };

    return await Employee.paginate(query, options);
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
