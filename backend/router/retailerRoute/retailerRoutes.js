const express = require('express');
const router = express.Router();
const retailerController = require('../../controller/retailerController');
const authMiddleware=require("../../middleware/authMiddleware")


router.use(authMiddleware.protect);
// Basic CRUD routes
router.post('/', retailerController.createRetailer);
router.get('/', retailerController.getAllRetailers);
router.get('/:id', retailerController.getRetailer);
router.patch('/:id', retailerController.updateRetailer);
router.delete('/:id', retailerController.deleteRetailer);

// Employee management
router.post('/:retailerId/employees', retailerController.createEmployeeForRetailer);

module.exports = router;