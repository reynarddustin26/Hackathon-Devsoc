import React from 'react';
import './Logo.css';

function Logo() {
  return (
    <div className="app-logo">
      <div className="logo-icon">
        <svg viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#FDB515"/>
          <path d="M10 12h20v3H10z M10 18h20v3H10z M10 24h20v3H10z" fill="white"/>
        </svg>
      </div>
      <div className="logo-text">
        <div className="logo-title">UniAuto</div>
        <div className="logo-subtitle">Crowd Tracker</div>
      </div>
    </div>
  );
}

export default Logo;