// Add in a separate file (jobs/expireBroadcasts.js)
const cron = require('node-cron');
const Broadcast = require('../model/BroadcastSchema');

cron.schedule('* * * * *', async () => {
  const expired = await Broadcast.updateMany(
    {
      status: 'pending',
      expiryTime: { $lte: new Date() }
    },
    { status: 'expired' }
  );
  
  console.log(`Expired ${expired.modifiedCount} broadcasts`);
});