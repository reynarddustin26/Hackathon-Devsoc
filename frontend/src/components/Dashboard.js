import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBuildings } from '../api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBuildings();
    
    // Auto-refresh every 10 seconds
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

  const getCrowdLevel = (occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return 'low';
    if (percentage < 80) return 'medium';
    return 'high';
  };

  const getCrowdColor = (level) => {
    switch(level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading && buildings.length === 0) {
    return (
      <div className="dashboard">
        <div className="loading">Loading crowd data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>🎓 UniAuto Crowd Tracker</h1>
        <p>Live occupancy across campus</p>
        {error && <div className="error-message">{error}</div>}
      </header>
      
      <div className="dashboard-actions">
        <button className="scan-button-main" onClick={() => navigate('/scan')}>
          📱 Scan QR Code
        </button>
        <button className="generate-button-main" onClick={() => navigate('/qr-generator')}>
          🎯 Generate QR Codes
        </button>
      </div>
      
      <div className="buildings-grid">
        {buildings.map(building => {
          const level = getCrowdLevel(building.occupancy, building.capacity);
          return (
            <div 
              key={building.id} 
              className="building-card"
              style={{ borderLeft: `5px solid ${getCrowdColor(level)}` }}
            >
              <h3>{building.name}</h3>
              <div className="occupancy">
                <span className="number">{building.occupancy}</span>
                <span className="capacity">/ {building.capacity}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(building.occupancy / building.capacity) * 100}%`,
                    backgroundColor: getCrowdColor(level)
                  }}
                />
              </div>
              <div className="crowd-label" style={{ color: getCrowdColor(level) }}>
                {level.toUpperCase()} CROWD
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="last-updated">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

export default Dashboard;