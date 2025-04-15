const Owner = require("../model/OnwerSchema");
const Retailer = require("../model/vendorSchema");
const { Email } = require("../utils/sendMail");

exports.registerOwner = async (ownerData) => {
  const owner = await Owner.create(ownerData);
  const url = `http://localhost:5173/login`;
  await new Email(retailer, url).welcomeOwner();
  return owner;
};

exports.loginOwner = async (email, password) => {
  const owner = await Owner.findOne({ email }).select("+password");

  if (!owner || !(await owner.comparePassword(password))) {
    throw new Error("Invalid email or password");
  }

  // Remove password from response
  owner.password = undefined;
  return owner;
};

exports.getOwnerById = async (id) => {
  return await Owner.findById(id).populate("storesOwned");
};

exports.updateOwner = async (id, updateData) => {
  if (updateData.password) {
    throw new Error("Use auth controller to update password");
  }

  return await Owner.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteOwner = async (id) => {
  // Delete all retailers owned by this owner first
  await Retailer.deleteMany({ ownerId: id });
  return await Owner.findByIdAndDelete(id);
};

exports.addStoreToOwner = async (ownerId, retailerId) => {
  return await Owner.findByIdAndUpdate(
    ownerId,
    { $addToSet: { storesOwned: retailerId } },
    { new: true }
  );
};
