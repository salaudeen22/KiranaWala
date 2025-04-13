const express = require('express');
const router = express.Router();
const broadcastController = require('../../controller/broadcastController');
const { customerProtect ,protect} = require('../../middleware/authMiddleware');

// Customer endpoints
router.post('/', 
  customerProtect, 
  broadcastController.createBroadcast
);

router.get('/', protect, broadcastController.getAvailableBroadcasts);

router.get('/customer', 
  customerProtect, 
  broadcastController.getCustomerBroadcasts
);

router.get('/:id', 
  customerProtect, 
  broadcastController.getBroadcastDetails
);

router.patch('/:id/cancel', 
  customerProtect, 
  broadcastController.cancelBroadcast
);

// Retailer endpoints
router.patch('/:id/accept', protect, broadcastController.acceptBroadcast);
router.patch("/:id/status", protect, broadcastController.updateBroadcastStatus);
module.exports = router;