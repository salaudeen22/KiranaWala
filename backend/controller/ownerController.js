const Owner = require('../model/OnwerSchema');
const { signToken, createSendToken } = require('../utils/auth');

exports.register = async (req, res) => {
  try {
    const owner = await Owner.create(req.body);
    res.status(201).json({
      success: true,
      data:owner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // 2) Check if owner exists and password is correct
    const owner = await Owner.findOne({ email }).select('+password');
    console.log(owner);

    if (!owner) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    const cmp = await owner.comparePassword(password);
    if (!cmp) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    // 3) If everything ok, send token
     createSendToken(owner, 200, res);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getOwner = async (req, res) => {
  try {
    // console.log("Inside Controllers",req.owner);
    const owner = await Owner.findById(req.owner.id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }
    res.status(200).json({
      success: true,
      data: owner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndUpdate(req.owner.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }
    res.status(200).json({
      success: true,
      data: owner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }
    res.status(204).json({
      success: true,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addStoreToOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndUpdate(
      req.owner.id,
      { $addToSet: { storesOwned: req.body.retailerId } },
      { new: true }
    ).populate('storesOwned');

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: owner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};