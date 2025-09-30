import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import './QRScanner.css';

function QRScanner() {
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText, decodedResult) {
      console.log(`QR Code detected: ${decodedText}`);
      scanner.clear();
      setScanning(false);
      
      // Parse the URL to get building info
      try {
        const url = new URL(decodedText);
        const buildingName = url.searchParams.get('building');
        
        if (buildingName) {
          // Navigate to success page with building name
          navigate(`/checkin-success?building=${buildingName}`);
        } else {
          alert('Invalid QR code format');
        }
      } catch (error) {
        alert('Invalid QR code');
      }
    }

    function onScanError(error) {
      // Ignore errors - they happen constantly while scanning
    }

    return () => {
      scanner.clear().catch(error => {
        console.error('Failed to clear scanner', error);
      });
    };
  }, [navigate]);

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-header">
        <h1>📱 Scan QR Code</h1>
        <p>Point your camera at a building's QR code to check in</p>
      </div>
      
      <div className="qr-scanner-wrapper">
        <div id="qr-reader"></div>
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default QRScanner;