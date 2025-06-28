const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const ReminderLog = require('../models/ReminderLog'); // ✅ New log model
const sendEmail = require('./mailer');
const sendSMS = require('./sms');

// 🔁 Run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  // Calculate "HH:MM" string for 5 minutes from now
  const plus5 = new Date(now.getTime() + 5 * 60000);
  const timePlus5 = plus5.toTimeString().slice(0, 5);

  try {
    const tasks = await Task.find({
      completed: false,
      medicines: { $exists: true, $ne: [] }
    }).populate('userId');

    for (const task of tasks) {
      const user = task.userId;

      for (const med of task.medicines) {
        const shouldSendNow =
          med.time === currentTime || med.time === timePlus5;

        if (!shouldSendNow) continue;

        const existingReminder = await ReminderLog.findOne({
          taskId: task._id,
          medicineName: med.name,
          time: med.time,
          type: { $in: ['email', 'sms'] },
          window: med.time === timePlus5 ? 'before' : 'on',
          sentAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)), // From start of day
            $lte: new Date()
          }
        });

        if (existingReminder) continue; // ✅ Skip duplicates

        const timingLabel = med.time === timePlus5 ? 'soon in 5 minutes' : 'now';
        const message = `⏰ Reminder: Take your medicine "${med.name}" for "${task.title}" ${timingLabel}.`;

        try {
          if (user.email) {
            await sendEmail(user.email, 'Medicine Reminder', message);
            await ReminderLog.create({
              taskId: task._id,
              userId: user._id,
              medicineName: med.name,
              time: med.time,
              type: 'email',
              window: med.time === timePlus5 ? 'before' : 'on',
              status: 'success'
            });
          }

          if (user.phone) {
            await sendSMS(user.phone, message);
            await ReminderLog.create({
              taskId: task._id,
              userId: user._id,
              medicineName: med.name,
              time: med.time,
              type: 'sms',
              window: med.time === timePlus5 ? 'before' : 'on',
              status: 'success'
            });
          }
        } catch (sendErr) {
          console.error(`❌ Failed to send reminder for ${med.name}:`, sendErr);
        }
      }
    }
  } catch (err) {
    console.error('❌ Reminder scheduler error:', err);
  }
});
