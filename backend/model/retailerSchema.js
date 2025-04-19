const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  serviceablePincodes: {
    type: [String],
    default: [],
  },
});

const Retailer = mongoose.model('Retailer', retailerSchema);

module.exports = Retailer;