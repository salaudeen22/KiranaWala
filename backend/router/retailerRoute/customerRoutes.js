const express = require('express');
const router = express.Router();
const customerController = require('../../controller/customerController');
const { customerProtect } = require('../../middleware/authMiddleware');





// Public routes
router.post('/register', customerController.register);
router.post('/login', customerController.login);
// z
// router.post('/forgot-password', customerController.f);

// Protected routes (customer must be logged in)
// router.use(protect);

// Customer profile management
router.get('/profile',customerProtect, customerController.getProfile);
router.put('/profile',customerProtect, customerController.updateProfile);
router.delete('/profile',customerProtect, customerController.deleteAccount);


// Address management
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


//addition
router.post('/broadcasts', customerProtect, customerController.createBroadcast);
router.get('/broadcasts', customerProtect, customerController.getCustomerBroadcasts);
router.get('/broadcasts/:id', customerProtect, customerController.getBroadcastDetails);
router.patch('/broadcasts/:id/cancel', customerProtect, customerController.cancelBroadcast);
module.exports = router;