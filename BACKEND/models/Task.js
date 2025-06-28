const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    time: { type: String, required: false }, // ✅ Now optional
  },
  { _id: false }
);

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    doctor: { type: String },
    notes: { type: String },
    medicines: [MedicineSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
