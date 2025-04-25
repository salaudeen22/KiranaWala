const cron = require('node-cron');
const Broadcast = require('../model/BroadcastSchema');

// Immediately update existing expired broadcasts
(async () => {
  try {
    const expired = await Broadcast.updateMany(
      {
        status: 'pending',
        expiryTime: { $lte: new Date() }
      },
      { $set: { status: 'expired' } } // Explicitly set status to 'expired'
    );
    console.log(`Initially expired ${expired.modifiedCount} broadcasts`);
  } catch (error) {
    console.error('Error updating initially expired broadcasts:', error);
  }
})();

// Schedule the cron job to run every minute
cron.schedule('* * * * *', async () => {
  try {
    const expired = await Broadcast.updateMany(
      {
        status: 'pending',
        expiryTime: { $lte: new Date() }
      },
      { $set: { status: 'expired' } } // Explicitly set status to 'expired'
    );

    console.log(`Expired ${expired.modifiedCount} broadcasts`);
  } catch (error) {
    console.error('Error updating expired broadcasts:', error);
  }
});