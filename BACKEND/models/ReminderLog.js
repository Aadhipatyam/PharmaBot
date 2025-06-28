const mongoose = require('mongoose');

const ReminderLogSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicineName: { type: String, required: true },
  time: { type: String, required: true }, // "HH:MM"
  window: {
    type: String,
    enum: ['before', 'on'], // ⏰ distinguish exact time vs 5-min-before
    default: 'on',
  },
  type: {
    type: String,
    enum: ['email', 'sms'],
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ReminderLog', ReminderLogSchema);
