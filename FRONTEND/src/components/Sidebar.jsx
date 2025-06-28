import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ tasks }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">📋 Tasks</h3>

      <ul className="sidebar-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <Link to={`/task/${task._id}`} className="sidebar-link">
                {task.title}
              </Link>
            </li>
          ))
        ) : (
          <li className="sidebar-empty">No tasks yet</li>
        )}
      </ul>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          🔓 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
