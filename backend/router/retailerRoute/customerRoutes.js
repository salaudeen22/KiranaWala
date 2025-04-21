const express = require('express');
const router = express.Router();
const customerController = require('../../controller/customerController');
const { customerProtect, protect } = require('../../middleware/authMiddleware');
const retailerController=require("../../controller/retailerController");





// Public routes
router.post('/register', customerController.register);
router.post('/login', customerController.login);
router.post('/forgot-password', customerController.requestPasswordReset);
router.post('/reset-password', customerController.resetPassword);

// Protected routes (customer must be logged in)
// router.use(protect);

// Customer profile management
router.get('/profile',customerProtect, customerController.getProfile);
router.put('/profile',customerProtect, customerController.updateProfile);
router.delete('/profile',customerProtect, customerController.deleteAccount);
router.put('/change-password', customerProtect, customerController.changePassword);


// Address management
router.get('/Alladdress',customerProtect,  customerController.getAllAddress);
router.post('/address',customerProtect,  customerController.addAddress);
router.put('/address/:addressId',customerProtect,  customerController.updateAddress);
router.delete('/address/:addressId',customerProtect,  customerController.deleteAddress);

// Wallet management
router.get('/wallet',customerProtect,  customerController.getWallet);
router.post('/wallet/topup',customerProtect,  customerController.topUpWallet);

// Wishlist management

router.get('/wishlist',customerProtect,  customerController.getWishlist);
router.post('/wishlist/:productId',customerProtect,  customerController.addToWishlist);
router.delete('/wishlist/:productId',customerProtect,  customerController.removeFromWishlist);


router.get('/orders', customerProtect, customerController.getOrders);
router.get('/orders/:id', customerProtect, customerController.getOrderDetails);
router.post('/orders', customerProtect, customerController.placeOrder);
router.patch('/orders/:id/cancel', customerProtect, customerController.cancelOrder);

// Broadcast routes
router.post('/broadcasts', customerProtect, customerController.createBroadcast);
router.get('/broadcasts', customerProtect, customerController.getCustomerBroadcasts);
router.get('/broadcasts/:id', customerProtect, customerController.getBroadcastDetails);
router.patch('/broadcasts/:id/cancel', customerProtect, customerController.cancelBroadcast);

// Add retailer-specific routes
router.get('/retailer/broadcasts', protect, retailerController.getAvailableBroadcasts);
router.patch('/retailer/broadcasts/:id/accept', protect, retailerController.acceptBroadcast);
// router.patch('/retailer/broadcasts/:id/complete', protect, retailerController.completeBroadcast);
module.exports = router;