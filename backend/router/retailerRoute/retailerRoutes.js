const express = require('express');
const router = express.Router();
const retailerController = require('../../controller/retailerController');
const authMiddleware=require("../../middleware/authMiddleware")

router.post('/', retailerController.createRetailer);
router.post("/login",retailerController.login);
router.use(authMiddleware.protect);
// Basic CRUD routes


router.get('/getAll', retailerController.getAllRetailers);
router.get('/', retailerController.getRetailer);
router.patch('/', retailerController.updateRetailer); // Ensure the PATCH route for updating retailer settings is correctly defined
router.delete('/', retailerController.deleteRetailer);

// Employee management
router.post('/employees', retailerController.createEmployeeForRetailer);

// Service area management
router.patch('/service-area', retailerController.updateServiceArea);

module.exports = router;