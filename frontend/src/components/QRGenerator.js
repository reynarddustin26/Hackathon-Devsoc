import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './QRGenerator.css';

function QRGenerator() {
  const navigate = useNavigate();
  const qrCodesRef = useRef([]);

  const buildings = [
    { id: 1, name: 'Library' },
    { id: 2, name: 'Quad' },
    { id: 3, name: 'Law Building' },
    { id: 4, name: 'Engineering' },
  ];

  useEffect(() => {
    // Dynamically load QRCode library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async = true;
    script.onload = () => {
      generateQRCodes();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const generateQRCodes = () => {
    buildings.forEach((building, index) => {
      const container = document.getElementById(`qr-${building.id}`);
      if (container && window.QRCode) {
        // Clear existing QR code
        container.innerHTML = '';
        
        // Generate QR code URL
        const checkInUrl = `${window.location.origin}/checkin-success?building=${encodeURIComponent(building.name)}`;
        
        new window.QRCode(container, {
          text: checkInUrl,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel.H
        });
      }
    });
  };

  const downloadQR = (buildingName) => {
    const qrContainer = document.getElementById(`qr-${buildings.find(b => b.name === buildingName).id}`);
    const canvas = qrContainer.querySelector('canvas');
    
    if (canvas) {
      const link = document.createElement('a');
      link.download = `QR-${buildingName}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const printAllQRCodes = () => {
    window.print();
  };

  return (
    <div className="qr-generator-container">
      <div className="qr-generator-header">
        <h1>🎯 QR Code Generator</h1>
        <p>Generate QR codes for each building entrance</p>
      </div>

      <div className="action-buttons">
        <button className="print-all-button" onClick={printAllQRCodes}>
          🖨️ Print All QR Codes
        </button>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="qr-grid">
        {buildings.map(building => (
          <div key={building.id} className="qr-card">
            <h3>{building.name}</h3>
            <div className="qr-code-wrapper">
              <div id={`qr-${building.id}`} className="qr-code"></div>
            </div>
            <p className="qr-instructions">
              Print and place this QR code at the {building.name} entrance
            </p>
            <button 
              className="download-button"
              onClick={() => downloadQR(building.name)}
            >
              📥 Download QR Code
            </button>
          </div>
        ))}
      </div>

      <div className="usage-instructions">
        <h2>📋 How to Use</h2>
        <ol>
          <li>Download or print the QR codes above</li>
          <li>Place each QR code at the corresponding building entrance</li>
          <li>Students scan the QR code with the app to check in</li>
          <li>The dashboard updates with real-time occupancy data</li>
        </ol>
      </div>
    </div>
  );
}

export default QRGenerator;