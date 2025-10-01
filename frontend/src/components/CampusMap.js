import React from 'react';
import './CampusMap.css';

function CampusMap({ buildings }) {
  const getOccupancyColor = (occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return '#10b981'; // Green
    if (percentage < 80) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getOccupancyLabel = (occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return 'Available';
    if (percentage < 80) return 'Moderate';
    return 'Full';
  };

// Building positions on the map (you can adjust these)
const buildingPositions = {
  // Top Left - NIDA Area
  'NIDA': { top: '15%', left: '8%' },
  'NIDA / NIDA Parade Theatre': { top: '15%', left: '8%' },
  'NIDA Parade Theatre': { top: '22%', left: '8%' },
  
  // Top Center-Left - West Campus
  'International House': { top: '18%', left: '25%' },
  'Fitness & Aquatic Centre': { top: '12%', left: '22%' },
  'Squarehouse': { top: '28%', left: '22%' },
  'Blockhouse': { top: '42%', left: '22%' },
  
  // Center Left Area
  'Roundhouse': { top: '35%', left: '28%' },
  'Science and Engineering': { top: '32%', left: '38%' },
  'Science & Engineering Building': { top: '32%', left: '38%' },
  'Hilmer Building': { top: '35%', left: '48%' },
  'Law Building': { top: '42%', left: '38%' },
  'Chemical Sciences': { top: '48%', left: '52%' },
  
  // Top Right - Residential Colleges
  'Colombo House': { top: '8%', left: '68%' },
  'Fig Tree Hall': { top: '12%', left: '75%' },
  'Fig Tree Hall / Fig Tree Theatre': { top: '12%', left: '75%' },
  'Fig Tree Theatre': { top: '12%', left: '75%' },
  'White House': { top: '18%', left: '68%' },
  'UNSW Hall': { top: '25%', left: '70%' },
  'Goldstein Hall': { top: '28%', left: '75%' },
  'Goldstein College': { top: '28%', left: '75%' },
  'Goldstein College / Goldstein Hall': { top: '28%', left: '75%' },
  'Basser College': { top: '32%', left: '82%' },
  'Philip Baxter College': { top: '38%', left: '85%' },
  
  // Center - Main Campus
  'UNSW Village': { top: '18%', left: '52%' },
  'University Terraces': { top: '15%', left: '42%' },
  'Esme Timbery Creative Practice Lab': { top: '22%', left: '35%' },
  'Creative Practice Lab': { top: '22%', left: '35%' },
  
  // Central Academic Buildings
  'UNSW Business School': { top: '38%', left: '58%' },
  'Business School': { top: '38%', left: '58%' },
  'Dalton': { top: '45%', left: '58%' },
  'Dalton Building': { top: '45%', left: '58%' },
  'Science Theatre': { top: '48%', left: '65%' },
  
  // Right Side - Engineering Area
  'Quadrangle': { top: '42%', left: '72%' },
  'Robert Webster': { top: '48%', left: '72%' },
  'Robert Webster Building': { top: '48%', left: '72%' },
  'Rupert Myers': { top: '52%', left: '78%' },
  'Rupert Myers Building': { top: '52%', left: '78%' },
  'Rupert Myers Building / Theatre': { top: '52%', left: '78%' },
  'Electrical Engineering': { top: '55%', left: '85%' },
  
  // Bottom Center - Main Buildings
  'Red Centre': { top: '58%', left: '62%' },
  'The Red Centre': { top: '58%', left: '62%' },
  'Keith Burrows Theatre': { top: '62%', left: '65%' },
  'Physics Theatre': { top: '65%', left: '68%' },
  'Old Main': { top: '72%', left: '65%' },
  'Old Main Building': { top: '72%', left: '65%' },
  'Ainsworth Building': { top: '68%', left: '78%' },
  'Willis Annexe': { top: '72%', left: '82%' },
  
  // Bottom Right
  'Rupert Myers Theatre': { top: '78%', left: '78%' },
  'Myers Theatre': { top: '78%', left: '78%' },
  
  // Bottom Left - South Campus
  'Tyree Energy Technologies Building': { top: '62%', left: '38%' },
  'Tyree Energy Technologies Building (TETB)': { top: '62%', left: '38%' },
  'Tyree': { top: '62%', left: '38%' },
  'Civil Engineering Pavilion': { top: '65%', left: '42%' },
  'Newton': { top: '68%', left: '52%' },
  'Newton Building': { top: '68%', left: '52%' },
  
  // Bottom - Residential
  'New College': { top: '75%', left: '42%' },
  'New College / Postgraduate Village': { top: '75%', left: '42%' },
  'Building L5': { top: '78%', left: '38%' },
  'Warrane College': { top: '85%', left: '38%' },
  'House at Pooh Corner': { top: '88%', left: '42%' },
  'Barker Apartments': { top: '88%', left: '52%' },
  'Barker': { top: '88%', left: '52%' },
  
  // Far Bottom Right
  'Barker Street Parking Station': { top: '88%', left: '78%' },
  
  // Main Library - Center Top
  'Main Library': { top: '12%', left: '58%' },
  'Library': { top: '12%', left: '58%' },
  
  // Add any other buildings from your backend list
  'Mathews': { top: '25%', left: '62%' },
  'Mathews / Mathews Theatres / Mathews Arcade': { top: '25%', left: '62%' },
  'Central Lecture Block': { top: '28%', left: '68%' },
  'Central Lecture Block (CLB)': { top: '28%', left: '68%' },
  'CLB': { top: '28%', left: '68%' },
  
  // Science buildings
  'Wallace Wurth Building': { top: '55%', left: '58%' },
  'Wallace Wurth': { top: '55%', left: '58%' },
  'John Goodsell Building': { top: '58%', left: '55%' },
  'Goodsell': { top: '58%', left: '55%' },
  'Morven Brown Building': { top: '32%', left: '68%' },
  'Morven Brown': { top: '32%', left: '68%' },
  'John Niland Scientia Building': { top: '48%', left: '45%' },
  'Scientia Building': { top: '48%', left: '45%' },
  'Scientia': { top: '48%', left: '45%' },
  
  // Additional
  'Chancellery': { top: '22%', left: '52%' },
  'Chancellery Building': { top: '22%', left: '52%' },
  'Clancy Auditorium': { top: '38%', left: '52%' },
  'Clancy': { top: '38%', left: '52%' },
  'Lowy Cancer Research Centre': { top: '52%', left: '48%' },
  'Lowy': { top: '52%', left: '48%' },
  'Colombo House': { top: '8%', left: '68%' },
  
  // UNSW Regiment area (bottom left)
  'UNSW Regiment': { top: '62%', left: '12%' },
  'UNSW Regiment 2': { top: '65%', left: '12%' },
  
  // Solar/Research (far left)
  'Solar Industrial Research Facility': { top: '55%', left: '8%' },
  'Solar Industrial Research Facility (SIRF)': { top: '55%', left: '8%' },
  'SIRF': { top: '55%', left: '8%' },
  
  // Shalom area
  'Shalom College': { top: '72%', left: '15%' },
  'Shalom': { top: '72%', left: '15%' },
};
  return (
    <div className="campus-map-container">
      <div className="map-wrapper">
        {/* Map background - you can replace this with an actual campus map image */}
        <div className="map-background">
          <div className="map-grid"></div>
        </div>

        {/* Building markers */}
        {buildings.map(building => {
          const position = buildingPositions[building.name] || { top: '50%', left: '50%' };
          const percentage = (building.occupancy / building.capacity) * 100;
          const color = getOccupancyColor(building.occupancy, building.capacity);

          return (
            <div
              key={building.id}
              className="building-marker"
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              {/* Building icon/dot */}
              <div className="building-dot" style={{ borderColor: color }}>
                <div className="building-pulse" style={{ backgroundColor: color }}></div>
              </div>

              {/* Building info card */}
              <div className="building-info-card">
                <div className="building-name">{building.name}</div>
                <div className="building-occupancy">
                  <span className="occupancy-number">{building.occupancy}</span>
                  <span className="occupancy-total">/{building.capacity}</span>
                </div>

                {/* Occupancy bar */}
                <div className="occupancy-bar">
                  <div
                    className="occupancy-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  ></div>
                </div>

                <div className="occupancy-status" style={{ color: color }}>
                  {getOccupancyLabel(building.occupancy, building.capacity)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#10b981' }}></div>
          <span>Available (&lt;50%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></div>
          <span>Moderate (50-80%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Full (&gt;80%)</span>
        </div>
      </div>
    </div>
  );
}

export default CampusMap;