const express = require('express');
const router = express.Router();
const ownerController = require('../../controller/ownerController');
const { ownerProtect, ownerAuthorize } = require('../../middleware/authMiddleware');

// Public routes
router.post('/register', ownerController.register);
router.post('/login', ownerController.login);

// Protected routes
router.get('/:id', ownerProtect, ownerController.getOwner);
router.put('/:id', ownerProtect, ownerController.updateOwner);
router.delete('/:id', ownerProtect, ownerAuthorize('admin'), ownerController.deleteOwner);

router.patch('/:id/add-store', ownerProtect, ownerController.addStoreToOwner);

module.exports = router;