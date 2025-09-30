import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './InteractiveCampusMap.css';

function InteractiveCampusMap({ buildings }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

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
        </div>
      )}
    </div>
  );
}

export default InteractiveCampusMap;