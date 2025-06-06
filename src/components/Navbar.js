import React from 'react';
import './components.css';

function Navbar({ theme, onThemeToggle }) {
  return (
    <nav className="navbar">
      <div className="navbar-title">Facial Expression App</div>
      <div className="navbar-actions">
        <button className="theme-toggle-btn" onClick={onThemeToggle}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        {/* Add more navbar actions/links here if needed */}
      </div>
    </nav>
  );
}

export default Navbar;