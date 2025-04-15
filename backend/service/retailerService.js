const Retailer = require("../model/vendorSchema");
const bcrypt = require("bcryptjs");
const { Email } = require("../utils/sendMail");

exports.createRetailer = async (retailerData) => {
  const retailer = new Retailer(retailerData);
  await retailer.save();
  const url = `http://localhost:5173/login`;
  await new Email(retailer, url).sendWelcome();
  return retailer;
};

exports.getAllRetailers = async () => {
  return await Retailer.find().select("-password");
};

exports.getRetailerById = async (id) => {
  return await Retailer.findById(id).select("-password");
};

exports.updateRetailer = async (id, updateData) => {
  // Prevent password update via this method
  if (updateData.password) {
    throw new Error("Use auth controller to update password");
  }

  return await Retailer.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

exports.deleteRetailer = async (id) => {
  return await Retailer.findByIdAndDelete(id);
};

// In RetailerService.js
exports.completeOrder = async (retailerId, products) => {
  const bulkOps = products.map((product) => ({
    updateOne: {
      filter: {
        retailerId: mongoose.Types.ObjectId(retailerId),
        "inventory.productId": mongoose.Types.ObjectId(product.productId),
      },
      update: {
        $inc: { "inventory.$.reserved": -product.quantity },
      },
    },
  }));

  await Retailer.bulkWrite(bulkOps);
};

// retailerController.js
exports.createEmployeeForRetailer = async (req, res) => {
  try {
    const { retailerId } = req.params;
    const employeeData = req.body;

    // Set the retailerId from the route parameter
    employeeData.retailerId = retailerId;

    const employee = await employeeService.createEmployee(employeeData);

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
