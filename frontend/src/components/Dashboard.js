import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBuildings, onBuildingsUpdate } from '../api';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'busiest', 'moderate', 'available'

  useEffect(() => {
    let mounted = true;
    
    // Initial load
    loadBuildings();
    
    // Set up polling at a reasonable interval
    const pollInterval = setInterval(async () => {
      if (mounted) {
        await loadBuildings();
      }
    }, 10000); // Poll every 10 seconds
    
    // Subscribe to immediate updates from check-ins
    const unsubscribe = onBuildingsUpdate((newData) => {
      if (mounted && newData) {
        setBuildings(newData);
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, []);

  const loadBuildings = async () => {
    try {
      if (!loading) {  // Only load if not already loading
        setLoading(true);
        const data = await fetchBuildings();
        if (Array.isArray(data) && data.length > 0) {
          setBuildings(data);
          setError(null);
        } else if (!buildings.length) {  // Only set error if we don't have any existing data
          setError('No buildings data available');
        }
      }
    } catch (err) {
      console.error('Error loading buildings:', err);
      if (!buildings.length) {  // Only set error if we don't have any existing data
        setError('Failed to load buildings data');
      }
    } finally {
      setLoading(false);
    }
  };


  // Helper to get crowd level
  const getCrowdLevel = (occupancy, capacity) => {
    const ratio = occupancy / capacity;
    if (ratio >= 0.8) return 'busiest';
    if (ratio >= 0.5) return 'moderate';
    return 'available';
  };

  // Filter buildings based on search and status
  let filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (statusFilter !== 'all') {
    filteredBuildings = filteredBuildings.filter(b => getCrowdLevel(b.occupancy, b.capacity) === statusFilter);
  }

  // Leaderboard: top 3 busiest buildings
  const topBusiest = [...buildings]
    .sort((a, b) => (b.occupancy / b.capacity) - (a.occupancy / a.capacity))
    .slice(0, 3);

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
    

    {/* Leaderboard for Top 3 Busiest Buildings */}
    <div className="leaderboard">
      <h2>🏆 Top 3 Busiest Buildings</h2>
      <ol>
        {topBusiest.map((b, idx) => (
          <li key={b.id} style={{ fontWeight: idx === 0 ? 'bold' : 'normal' }}>
            {b.name} ({b.occupancy}/{b.capacity})
            <span style={{ color: getCrowdLevel(b.occupancy, b.capacity) === 'busiest' ? '#ef4444' : getCrowdLevel(b.occupancy, b.capacity) === 'moderate' ? '#f59e0b' : '#10b981', marginLeft: 8 }}>
              {getCrowdLevel(b.occupancy, b.capacity).charAt(0).toUpperCase() + getCrowdLevel(b.occupancy, b.capacity).slice(1)}
            </span>
          </li>
        ))}
      </ol>
    </div>

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
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        className="status-filter"
        style={{ marginLeft: 12 }}
      >
        <option value="all">All</option>
        <option value="busiest">Busiest</option>
        <option value="moderate">Moderate</option>
        <option value="available">Available</option>
      </select>
    </div>

    <InteractiveCampusMap buildings={filteredBuildings} />
    
    <div className="last-updated">
      Last updated: {new Date().toLocaleTimeString()}
    </div>
  </div>
);
}

export default Dashboard;