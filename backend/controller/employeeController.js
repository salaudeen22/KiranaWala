const employeeService = require("../service/employeeService");

async function addEmployee(req, res) {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getEmployees(req, res) {
  try {
    const employees = await employeeService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getEmployee(req, res) {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    // Only allow updating these fields
    const updateData = { name, email, phone, role };
    
    const updatedEmployee = await employeeService.updateEmployee(id, updateData);
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ 
      message: "Employee updated successfully", 
      employee: updatedEmployee 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function deleteEmployee(req, res) {
  try {
    await employeeService.deleteEmployee(req.params.id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { addEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee };
