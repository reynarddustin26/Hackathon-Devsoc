import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBuildings } from '../api';
import CampusMap from './CampusMap';
import Logo from './Logo';
import InteractiveCampusMap from './InteractiveCampusMap';
import './Dashboard.css';


function Dashboard() {
  // ALL hooks must be at the top
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Moved here!

  useEffect(() => {
    loadBuildings();
  
    const interval = setInterval(() => {
      loadBuildings();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadBuildings = async () => {
    try {
      setLoading(true);
      const data = await fetchBuildings();
      setBuildings(data);
      setError(null);
    } catch (err) {
      setError('Failed to load buildings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter buildings based on search
  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Early return comes AFTER all hooks
  if (loading && buildings.length === 0) {
    return (
      <div className="dashboard">
        <div className="loading">Loading crowd data...</div>
      </div>
    );
  }

  return (
  <div className="dashboard">
    <header className="dashboard-header">
      <div className="header-top">
        <Logo />
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-number">{buildings.length}</div>
            <div className="stat-label">Buildings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {buildings.reduce((sum, b) => sum + b.occupancy, 0)}
            </div>
            <div className="stat-label">Total People</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {buildings.filter(b => (b.occupancy/b.capacity) < 0.5).length}
            </div>
            <div className="stat-label">Available</div>
          </div>
        </div>
      </div>
      <div className="header-bottom">
        <h1>Campus Occupancy Monitor</h1>
        <p>Real-time crowd tracking across UNSW Kensington</p>
      </div>
      {error && <div className="error-message">{error}</div>}
    </header>
    
    <div className="dashboard-actions">
      <button className="scan-button-main" onClick={() => navigate('/scan')}>
        📱 Scan QR Code
      </button>
    </div>

    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 Search buildings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>

    <InteractiveCampusMap buildings={filteredBuildings} />
    
    <div className="last-updated">
      Last updated: {new Date().toLocaleTimeString()}
    </div>
  </div>
);
}

export default Dashboard;