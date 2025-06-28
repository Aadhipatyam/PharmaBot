import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // NEW

export default function TaskList({ tasks, fetchTasks, title, type }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const toggleComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/tasks/${editId}`,
        { title: editTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving edited task:', error);
    }
  };

  const getDateLabel = (task) => {
    if (type === 'completed') {
      return new Date(task.completedAt).toLocaleString();
    } else if (type === 'ongoing' || type === 'reminder') {
      return new Date(task.date).toLocaleDateString();
    } else {
      return '-';
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      {tasks.length === 0 ? (
        <p>No tasks Registered</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>{type === 'completed' ? 'Completed At' : 'Scheduled For'}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>
                  {editId === task._id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  ) : (
                    <>
                      <strong>
                        <Link
                          to={`/task/${task._id}`}
                          style={{ color: 'lightcoral', textDecoration: 'none' }}
                        >
                          {task.title}
                        </Link>
                      </strong>
                      {task.description && (
                        <p
                          style={{
                            marginTop: '0.3rem',
                            fontSize: '0.9rem',
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {task.description}
                        </p>
                      )}
                    </>
                  )}
                </td>
                <td>{getDateLabel(task)}</td>
                <td>
                  {type !== 'completed' && editId === task._id ? (
                    <>
                      <button onClick={saveEdit}>💾 Save</button>
                      <button onClick={() => setEditId(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      {(type === 'ongoing' || type === 'reminder') && (
                        <button onClick={() => startEdit(task)}>✏️ Edit</button>
                      )}
                      <button onClick={() => toggleComplete(task._id)}>
                        {task.completed ? '↩️ Redo' : '✔️ Done'}
                      </button>
                      <button onClick={() => deleteTask(task._id)}>🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
