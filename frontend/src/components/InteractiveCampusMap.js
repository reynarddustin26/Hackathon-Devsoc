import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './InteractiveCampusMap.css';

function InteractiveCampusMap({ buildings }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [qrModal, setQrModal] = useState({ open: false, loading: false, qr: null, error: null, building: null });
  // Helper to get building id from name (for demo, use lowercase and remove spaces)
  const getBuildingId = (name) => {
    if (!name) return '';
    // Try to match known ids for demo
    const map = {
      'Main Library': 'library',
      'Mathews': 'mathews',
      'Central Lecture Block': 'clb',
      'Hilmer Building': 'hilmer',
      'Science & Engineering': 'sci_eng',
      'Business School': 'business_school',
      'Law Building': 'law',
      'Blockhouse': 'blockhouse',
      'Tyree': 'tyree',
      'Roundhouse': 'roundhouse',
      'Squarehouse': 'squarehouse',
      'Morven Brown': 'morven_brown',
      'Quadrangle': 'quadrangle',
      'Red Centre': 'red_centre',
      'Scientia': 'scientia',
    };
    return map[name] || name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  };

  // Fetch QR code for building
  const fetchQrCode = async (building) => {
    setQrModal({ open: true, loading: true, qr: null, error: null, building });
    try {
      const id = getBuildingId(building.name);
      const response = await fetch(`https://hackathon-devsoc.onrender.com/api/buildings/${id}/qr`);
      if (!response.ok) throw new Error('Failed to fetch QR code');
      const data = await response.json();
      setQrModal({ open: true, loading: false, qr: data.qr, error: null, building });
    } catch (e) {
      setQrModal({ open: true, loading: false, qr: null, error: 'Could not load QR code.', building });
    }
  };

  // Mock building details (in real app, fetch from API)
  const buildingDetails = {
    'Main Library': {
      openingHours: '8:00 AM - 10:00 PM',
      facilities: ['Study Rooms', 'Computer Labs', 'Printing', 'Cafe'],
    },
    'Mathews': {
      openingHours: '7:30 AM - 9:00 PM',
      facilities: ['Lecture Theatres', 'Tutorial Rooms', 'Study Spaces'],
    },
    'Central Lecture Block': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Lecture Theatres', 'Accessible Toilets'],
    },
    'Hilmer Building': {
      openingHours: '8:00 AM - 7:00 PM',
      facilities: ['Labs', 'Study Spaces', 'Cafe'],
    },
    'Science & Engineering': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Labs', 'Lecture Theatres', 'Makerspace'],
    },
    'Business School': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Lecture Theatres', 'Study Pods', 'Cafe'],
    },
    'Law Building': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Lecture Theatres', 'Law Library', 'Study Rooms'],
    },
    'Blockhouse': {
      openingHours: '8:00 AM - 6:00 PM',
      facilities: ['Student Services', 'Meeting Rooms'],
    },
    'Tyree': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Labs', 'Study Spaces'],
    },
    'Roundhouse': {
      openingHours: '10:00 AM - 11:00 PM',
      facilities: ['Event Space', 'Bar', 'Food Court'],
    },
    'Squarehouse': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Food Outlets', 'Arc Office', 'Study Spaces'],
    },
    'Morven Brown': {
      openingHours: '8:00 AM - 7:00 PM',
      facilities: ['Lecture Theatres', 'Tutorial Rooms'],
    },
    'Quadrangle': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Lecture Theatres', 'Study Spaces'],
    },
    'Red Centre': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Labs', 'Studios', 'Gallery'],
    },
    'Scientia': {
      openingHours: '8:00 AM - 8:00 PM',
      facilities: ['Event Space', 'Lecture Theatre'],
    },
    // ...add more as needed
  };

  const getOccupancyColor = (occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return '#10b981';
    if (percentage < 80) return '#f59e0b';
    return '#ef4444';
  };

  const getOccupancyLabel = (occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return 'Available';
    if (percentage < 80) return 'Moderate';
    return 'Full';
  };

  // Building positions based on the grid system in the official map
  // Grid coordinates (column, row) converted to percentages
  const buildingPositions = {
// Column 5, Row E - Squarehouse
  'Squarehouse': { x: 17.9, y: 35.7 },
  'Squarehouse (E4)': { x: 17.9, y: 35.7 },
  
  // Column 6, Row E - Roundhouse (circular)
  'Roundhouse': { x: 21.4, y: 35.7 },
  'Roundhouse (E6)': { x: 21.4, y: 35.7 },
  
  // Column 7, Row F - Blockhouse
  'Blockhouse': { x: 25, y: 42.9 },
  'Blockhouse (G6)': { x: 25, y: 42.9 },
  
  // Column 8-9, Row E - Science & Engineering
  'Science & Engineering': { x: 30.4, y: 35.7 },
  'Science & Engineering Building': { x: 30.4, y: 35.7 },
  'Science and Engineering': { x: 30.4, y: 35.7 },
  
  // Column 8, Row H - Tyree
  'Tyree Energy Technologies Building (TETB)': { x: 28.6, y: 57.1 },
  'Tyree': { x: 28.6, y: 57.1 },
  
  // Column 10, Row E - Hilmer
  'Hilmer Building': { x: 35.7, y: 35.7 },
  
  // Column 10, Row F - Law Building
  'Law Building': { x: 35.7, y: 42.9 },
  'Law Building (F8)': { x: 35.7, y: 42.9 },
  'Law and Justice Building (F8)': { x: 35.7, y: 42.9 },
  
  // Column 12, Row E - UNSW Business School
  'UNSW Business School': { x: 42.9, y: 35.7 },
  'Business School': { x: 42.9, y: 35.7 },
  
  // Column 12, Row F - Dalton
  'Dalton': { x: 42.9, y: 42.9 },
  'Dalton Building': { x: 42.9, y: 42.9 },
  
  // Column 13, Row F - Science Theatre
  'Science Theatre': { x: 46.4, y: 42.9 },
  
  // Column 13, Row H - Red Centre
  'Red Centre': { x: 46.4, y: 57.1 },
  'The Red Centre': { x: 46.4, y: 57.1 },
  
  // Column 14-15, Row E - Quadrangle
  'Quadrangle': { x: 51.8, y: 35.7 },
  
  // Column 14-15, Row F - Robert Webster
  'Robert Webster': { x: 51.8, y: 42.9 },
  'Robert Webster Building': { x: 51.8, y: 42.9 },
  
  // Column 15, Row C - Morven Brown
  'Morven Brown': { x: 53.6, y: 21.4 },
  'Morven Brown Building': { x: 53.6, y: 21.4 },
  
  // Column 16, Row F - Electrical Engineering
  'Electrical Engineering': { x: 57.1, y: 42.9 },
  
  // Column 17, Row D - Central Lecture Block
  'Central Lecture Block': { x: 60.7, y: 28.6 },
  'Central Lecture Block (CLB)': { x: 60.7, y: 28.6 },
  'CLB': { x: 60.7, y: 28.6 },
  
  // Column 17, Row E - Mathews
  'Mathews': { x: 60.7, y: 35.7 },
  'Mathews / Mathews Theatres / Mathews Arcade': { x: 60.7, y: 35.7 },
  
  // Column 18, Row E - Library
  'Main Library': { x: 64.3, y: 35.7 },
  'Library': { x: 64.3, y: 35.7 },
  
  // Column 19, Row G - Scientia
  'John Niland Scientia': { x: 67.9, y: 50 },
  'Scientia': { x: 67.9, y: 50 },
  'John Niland Scientia Building': { x: 67.9, y: 50 },
  
  // Column 10, Row F - Chemical Sciences
  'Chemical Sciences': { x: 35.7, y: 42.9 },
  
  // Column 12, Row H - Newton
  'Newton': { x: 42.9, y: 57.1 },
  'Newton Building': { x: 42.9, y: 57.1 },
  
  // Column 15, Row K - Old Main
  'Old Main': { x: 53.6, y: 78.6 },
  'Old Main Building': { x: 53.6, y: 78.6 },
  
  // Column 16, Row J - Keith Burrows Theatre
  'Keith Burrows Theatre': { x: 57.1, y: 71.4 },
  
  // Column 16, Row K - Physics Theatre
  'Physics Theatre': { x: 57.1, y: 78.6 },
  
  // Column 18, Row J - Ainsworth
  'Ainsworth Building': { x: 64.3, y: 71.4 },
  
  // Column 18, Row K - Willis Annexe
  'Willis Annexe': { x: 64.3, y: 78.6 },
  
  // Column 21, Row L - Rupert Myers
  'Rupert Myers': { x: 75, y: 85.7 },
  'Rupert Myers Building': { x: 75, y: 85.7 },
  
  // Column 13, Row H - Goodsell
  'Goodsell': { x: 46.4, y: 57.1 },
  'John Goodsell Building': { x: 46.4, y: 57.1 },
  
  // Column 16, Row C - Clancy Auditorium
  'Clancy Auditorium': { x: 57.1, y: 21.4 },
  
  // Column 16, Row B - Chancellery
  'Chancellery': { x: 57.1, y: 14.3 },
  'Chancellery Building': { x: 57.1, y: 14.3 },
  
  // Residential colleges - East side
  
  // Column 18, Row B - Colombo House
  'Colombo House': { x: 64.3, y: 14.3 },
  
  // Column 19, Row B - Fig Tree Hall
  'Fig Tree Hall': { x: 67.9, y: 14.3 },
  'Fig Tree Hall / Fig Tree Theatre': { x: 67.9, y: 14.3 },
  
  // Column 18, Row C - White House
  'White House': { x: 64.3, y: 21.4 },
  
  // Column 18, Row D - UNSW Hall
  'UNSW Hall': { x: 64.3, y: 28.6 },
  
  // Column 20, Row D - Goldstein
  'Goldstein College': { x: 71.4, y: 28.6 },
  'Goldstein Hall': { x: 71.4, y: 28.6 },
  'Goldstein College / Goldstein Hall': { x: 71.4, y: 28.6 },
  
  // Column 23, Row E - Basser
  'Basser College': { x: 82.1, y: 35.7 },
  
  // Column 25, Row E - Philip Baxter
  'Philip Baxter College': { x: 89.3, y: 35.7 },
  
  // Column 27, Row C - Wallace Wurth
  'Wallace Wurth': { x: 96.4, y: 21.4 },
  'Wallace Wurth Building': { x: 96.4, y: 21.4 },
  
  // Column 24, Row C - Lowy Cancer Research
  'Lowy Cancer Research Centre': { x: 85.7, y: 21.4 },
  
  // West campus
  
  // Column 3, Row C - International House
  'International House': { x: 10.7, y: 21.4 },
  
  // Column 3, Row D - NIDA
  'NIDA': { x: 10.7, y: 28.6 },
  'NIDA / NIDA Parade Theatre': { x: 10.7, y: 28.6 },
  
  // Column 10, Row C - UNSW Village
  'UNSW Village': { x: 35.7, y: 21.4 },
  
  // South campus
  
  // Column 7, Row L - New College
  'New College': { x: 25, y: 85.7 },
  'New College / Postgraduate Village': { x: 25, y: 85.7 },
  
  // Column 7, Row M - Warrane College
  'Warrane College': { x: 25, y: 92.9 },
  
  // Column 6, Row M - Shalom College
  'Shalom College': { x: 21.4, y: 92.9 },
  
  // Column 15, Row N - Barker Apartments
  'Barker Apartments': { x: 53.6, y: 100 },
  };

  return (
    <div className="interactive-map-container">
      <div className="map-controls-info">
        <div className="controls-text">
          Scroll to zoom • Click and drag to pan • Click markers for details
        </div>
      </div>

      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.8}
        maxScale={5}
        wheel={{ step: 0.15 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="map-toolbar">
              <button onClick={() => zoomIn()} className="map-btn" title="Zoom In">
                +
              </button>
              <button onClick={() => zoomOut()} className="map-btn" title="Zoom Out">
                −
              </button>
              <button onClick={() => resetTransform()} className="map-btn" title="Reset View">
                ⟲
              </button>
            </div>

            <TransformComponent>
              <div className="map-image-wrapper">
                {/* Official UNSW Campus Map */}
                <img 
                  src="/unsw-campus-map.jpg" 
                  alt="UNSW Campus Map"
                  className="campus-map-image"
                />
                
                {/* Occupancy markers overlay */}
                <div className="markers-overlay">
                  {buildings.map(building => {
                    const position = buildingPositions[building.name];
                    if (!position) return null;

                    const color = getOccupancyColor(building.occupancy, building.capacity);
                    const percentage = (building.occupancy / building.capacity) * 100;

                    return (
                      <div
                        key={building.id}
                        className="building-marker-dot"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`,
                        }}
                        onClick={() => setSelectedBuilding(building)}
                      >
                        <div 
                          className="marker-ring"
                          style={{ borderColor: color }}
                        >
                          <div 
                            className="marker-center"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                        <div 
                          className="marker-pulse"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Legend */}
      <div className="map-legend-fixed">
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#10b981' }} />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#f59e0b' }} />
          <span>Moderate</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#ef4444' }} />
          <span>Full</span>
        </div>
      </div>

      {/* Building detail panel */}
      {selectedBuilding && (
        <div className="building-detail-panel">
          <button 
            className="close-panel-btn"
            onClick={() => setSelectedBuilding(null)}
          >
            ×
          </button>
          <h3>{selectedBuilding.name}</h3>
          <div className="detail-occupancy">
            <span className="detail-number">{selectedBuilding.occupancy}</span>
            <span className="detail-total">/ {selectedBuilding.capacity}</span>
          </div>
          <div className="detail-bar">
            <div
              className="detail-bar-fill"
              style={{
                width: `${(selectedBuilding.occupancy / selectedBuilding.capacity) * 100}%`,
                backgroundColor: getOccupancyColor(selectedBuilding.occupancy, selectedBuilding.capacity),
              }}
            />
          </div>
          <div 
            className="detail-status"
            style={{
              color: getOccupancyColor(selectedBuilding.occupancy, selectedBuilding.capacity),
            }}
          >
            {getOccupancyLabel(selectedBuilding.occupancy, selectedBuilding.capacity)}
          </div>
          <div className="detail-section">
            <div className="detail-label">Opening Hours</div>
            <div className="detail-value">
              {buildingDetails[selectedBuilding.name]?.openingHours || '8:00 AM - 8:00 PM'}
            </div>
          </div>
          <div className="detail-section">
            <div className="detail-label">Facilities</div>
            <ul className="detail-facilities">
              {(buildingDetails[selectedBuilding.name]?.facilities || ['General Study Spaces']).map(facility => (
                <li key={facility}>{facility}</li>
              ))}
            </ul>
          </div>
          <button className="qr-btn" onClick={() => fetchQrCode(selectedBuilding)}>
            Show QR Code for Check-in/Out
          </button>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal.open && (
        <div className="qr-modal-overlay" onClick={() => setQrModal({ open: false, loading: false, qr: null, error: null, building: null })}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <button className="close-panel-btn" onClick={() => setQrModal({ open: false, loading: false, qr: null, error: null, building: null })}>×</button>
            <h3>QR Code for {qrModal.building?.name}</h3>
            {qrModal.loading && <div style={{padding: '24px', textAlign: 'center'}}>Loading QR code...</div>}
            {qrModal.error && <div style={{color: 'red', padding: '24px', textAlign: 'center'}}>{qrModal.error}</div>}
            {qrModal.qr && (
              <div style={{textAlign: 'center', padding: '16px'}}>
                <img src={qrModal.qr} alt={`QR for ${qrModal.building?.name}`} style={{width: '220px', height: '220px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px #0002'}} />
                <div style={{marginTop: '12px', color: '#6366f1', fontWeight: 600}}>
                  Scan to check-in or check-out
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveCampusMap;