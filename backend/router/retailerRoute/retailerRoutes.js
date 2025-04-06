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
router.patch('/', retailerController.updateRetailer);
router.delete('/', retailerController.deleteRetailer);

// Employee management
router.post('/employees', retailerController.createEmployeeForRetailer);

module.exports = router;