import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkIn } from '../api';
import './CheckInSuccess.css';

function CheckInSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const buildingName = searchParams.get('building') || 'Unknown Building';
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const performCheckIn = async () => {
      try {
        const result = await checkIn(buildingName);
        console.log('Check-in result:', result);
        setStatus('success');
      } catch (error) {
        console.error('Check-in failed:', error);
        setStatus('error');
      }
    };

    performCheckIn();
  }, [buildingName]);

  return (
    <div className="success-container">
      <div className="success-card">
        {status === 'processing' && (
          <>
            <div className="processing-icon">⏳</div>
            <h1>Processing Check-in...</h1>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="success-icon">✅</div>
            <h1>Check-in Successful!</h1>
            <p className="building-name">{buildingName}</p>
            <p className="timestamp">{new Date().toLocaleString()}</p>
            
            <div className="success-message">
              You've been checked in successfully. Thank you for helping track campus occupancy!
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="error-icon">⚠️</div>
            <h1>Check-in Failed</h1>
            <p className="error-message">
              Could not connect to server. Please try again later.
            </p>
          </>
        )}

        <button className="home-button" onClick={() => navigate('/')}>
          View Dashboard
        </button>
        
        <button className="scan-button" onClick={() => navigate('/scan')}>
          Scan Another QR Code
        </button>
      </div>
    </div>
  );
}

export default CheckInSuccess;