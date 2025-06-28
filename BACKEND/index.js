const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));    // ✅ Authentication (login, register)
app.use('/api/tasks', require('./routes/tasks'));  // ✅ Protected tasks route

// 🕒 Reminder scheduler (cron job for email/SMS)
// require('./utils/reminderScheduler'); // ✅ Add this line to activate reminders

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
