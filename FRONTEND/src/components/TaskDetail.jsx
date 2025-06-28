import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TaskDetail.css';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [doctor, setDoctor] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', time: '' }]);
  const [notes, setNotes] = useState('');

  // ✅ Fetch task by ID
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTask(res.data);
        setTitle(res.data.title || '');
        setDoctor(res.data.doctor || '');
        setMedicines(Array.isArray(res.data.medicines) && res.data.medicines.length > 0
          ? res.data.medicines
          : [{ name: '', time: '' }]
        );
        setNotes(res.data.notes || '');
      } catch (error) {
        console.error('Failed to fetch task:', error);
      }
    };
    fetchTask();
  }, [id]);

  const handleEditUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedTask = { title, doctor, medicines };
      const res = await axios.patch(`http://localhost:5000/api/tasks/${id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTask(res.data);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleNoteUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`http://localhost:5000/api/tasks/${id}`, { notes }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTask(res.data);
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', time: '' }]);
  };

  const handleRemoveMedicine = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated.length ? updated : [{ name: '', time: '' }]);
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="task-detail-wrapper">
      <h2>Edit Task</h2>
      <form className="task-form" onSubmit={handleEditUpdate}>
        <table className="task-edit-table">
          <tbody>
            <tr>
              <td>
                <label>Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
              <td>
                <label>Doctor:</label>
                <input
                  type="text"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <label>Medicines (🕐 Time is optional):</label>
                {medicines.map((med, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="time"
                      value={med.time}
                      onChange={(e) => handleMedicineChange(index, 'time', e.target.value)}
                    />
                    <button type="button" onClick={() => handleRemoveMedicine(index)}>🗑️</button>
                  </div>
                ))}
                <button type="button" onClick={handleAddMedicine} className="update-btn">➕ Add Medicine</button>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit" className="update-btn">Update Task</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <h3>Task Preview</h3>
      <table className="task-preview-table">
        <tbody>
          <tr><th>Title</th><td>{task.title}</td></tr>
          <tr><th>Doctor</th><td>{task.doctor}</td></tr>
          <tr>
            <th>Medicines</th>
            <td>
              {task.medicines?.map((m, i) => (
                <div key={i}>{m.name} {m.time && `— ${m.time}`}</div>
              ))}
            </td>
          </tr>
          <tr>
            <th>Notes</th>
            <td>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="notes-input"
              />
              <button onClick={handleNoteUpdate} className="update-btn">Update Notes</button>
            </td>
          </tr>
          <tr><th>Date</th><td>{new Date(task.date).toLocaleDateString()}</td></tr>
          <tr><th>Status</th><td>{task.completed ? '✅ Completed' : '⏳ Pending'}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default TaskDetail;
