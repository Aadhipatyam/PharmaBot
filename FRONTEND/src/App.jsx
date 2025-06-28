import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function AppContent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return !task.completed && taskDate >= today;
  });

  const ongoingTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return !task.completed && taskDate <= today;
  });

  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="dashboard-container">
      <Sidebar tasks={tasks} />
      <div className="app-container">
        <div className="theme-toggle">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <h1>💊 Medicine Reminder</h1>

        <div className="calendar-container">
          <Calendar value={selectedDate} onChange={setSelectedDate} />
        </div>

        <TaskForm selectedDate={selectedDate} fetchTasks={fetchTasks} />

        <div className="task-table">
          <TaskList
            tasks={reminderTasks}
            fetchTasks={fetchTasks}
            title="🔔 Reminder Tasks"
            type="reminder"
          />
        </div>

        <div className="task-lists">
          <div className="task-table">
            <TaskList
              tasks={ongoingTasks}
              fetchTasks={fetchTasks}
              title="⏳ Ongoing Tasks"
              type="ongoing"
            />
          </div>
          <div className="task-table">
            <TaskList
              tasks={completedTasks}
              fetchTasks={fetchTasks}
              title="✅ Completed Tasks"
              type="completed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Only allow access if token exists
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

// ✅ If already logged in, redirect to dashboard
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" /> : children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><AppContent /></ProtectedRoute>} />
        <Route path="/task/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        {/* 👇 Default route: redirect to /login if unmatched */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
