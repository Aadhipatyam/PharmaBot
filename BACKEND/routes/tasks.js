const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // ✅ JWT auth middleware

// ✅ Get all tasks for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ✅ Get a specific task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Invalid task ID' });
  }
});

// ✅ Create a new task (medicines added later)
router.post('/', auth, async (req, res) => {
  try {
    const { title, date, notes, doctor } = req.body;

    const task = new Task({
      title,
      date,
      notes,
      doctor,
      medicines: [], // 🟢 default empty
      userId: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ✅ Toggle task completion
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle completion' });
  }
});

// ✅ Update task fields
router.patch('/:id', auth, async (req, res) => {
  const { title, notes, doctor, medicines, date } = req.body;

  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (notes !== undefined) task.notes = notes;
    if (doctor !== undefined) task.doctor = doctor;
    if (date !== undefined) task.date = date;

    if (Array.isArray(medicines)) {
      const valid = medicines.every(m => typeof m.name === 'string' && m.name.trim() !== '');
      if (!valid) {
        return res.status(400).json({ error: 'Each medicine must have a non-empty name' });
      }
      // ✅ Accept optional time
      task.medicines = medicines;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Task update failed' });
  }
});

// ✅ Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Task.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found or already deleted' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
