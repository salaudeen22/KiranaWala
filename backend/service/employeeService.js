const mongoose = require("mongoose");
const Employee = require("../model/EmployeeSchema");
const Retailer = require("../model/vendorSchema");

async function createEmployee(data) {
  const { name, email, phone, role, retailerId, panCard, aadhaarCard, profileImage } = data;

  if (!retailerId) throw new Error("Retailer ID is required");

  const retailer = await Retailer.findById(retailerId);
  if (!retailer) throw new Error("Retailer not found");

  const employee = new Employee({
    name,
    email,
    phone,
    role,
    retailerId: new mongoose.Types.ObjectId(retailerId),
    panCard,
    aadhaarCard,
    userImage: profileImage,
  });

  await employee.save();

  retailer.employees.push(employee._id);
  await retailer.save();

  return employee;
}

async function getAllEmployees() {
  return await Employee.find().populate("retailerId", "name email");
}

async function getEmployeeById(id) {
  return await Employee.findById(id).populate("retailerId", "name email");
}

async function updateEmployee(id, updateData) {
  return await Employee.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteEmployee(id) {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) throw new Error("Employee not found");

  await Retailer.updateOne({ employees: employee._id }, { $pull: { employees: employee._id } });

  return employee;
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
