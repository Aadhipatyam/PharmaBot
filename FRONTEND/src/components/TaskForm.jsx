import { useState } from 'react';
import axios from 'axios';

function TaskForm({ selectedDate, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/tasks',
        {
          title,
          date: selectedDate,
          doctor,
          notes,
          medicines: [], // ❌ No medicine entry here; handled in TaskDetail only
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setTitle('');
      setDoctor('');
      setNotes('');
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Please login again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Medicine title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Doctor name..."
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
      />
      <textarea
        placeholder="Notes / Symptoms..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />
      <button type="submit">Add Reminder</button>
    </form>
  );
}

export default TaskForm;
