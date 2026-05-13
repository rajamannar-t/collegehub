import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div className="public-navbar">
      <div className="public-navbar-container">
        <div 
          className="public-navbar-logo" 
          onClick={() => handleNavigation('/')}
        >
          College<span>Hub</span>
        </div>
        
        <div className="public-navbar-links">
          <button 
            className={`public-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => handleNavigation('/')}
          >
            Home
          </button>
          <button 
            className={`public-nav-link ${location.pathname === '/clubs' ? 'active' : ''}`}
            onClick={() => handleNavigation('/clubs')}
          >
            Clubs
          </button>
        </div>

        <div className="public-navbar-actions">
          <button 
            className="btn btn-ghost" 
            onClick={() => handleNavigation('/login/student')}
          >
            Login
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => handleNavigation('/login/admin')}
          >
            HOD Login
          </button>
        </div>
      </div>
    </div>
  );
}
