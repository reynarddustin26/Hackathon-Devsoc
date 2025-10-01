import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { checkIn, checkOut } from '../api';

const buildingNames = {
  library: 'Main Library',
  mathews: 'Mathews',
  clb: 'Central Lecture Block',
  hilmer: 'Hilmer Building',
  sci_eng: 'Science & Engineering',
  business_school: 'Business School',
  law: 'Law Building',
  blockhouse: 'Blockhouse',
  tyree: 'Tyree',
  roundhouse: 'Roundhouse',
  squarehouse: 'Squarehouse',
  morven_brown: 'Morven Brown',
  quadrangle: 'Quadrangle',
  red_centre: 'Red Centre',
  scientia: 'Scientia',
};

export default function CheckInOutPage() {
  const { id } = useParams();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const buildingName = buildingNames[id] || id;

  const handleCheck = async (type) => {
    setStatus('loading');
    try {
      const fn = type === 'in' ? checkIn : checkOut;
      const res = await fn(buildingName);
      setStatus('success');
      setMessage(res.message || (type === 'in' ? 'Checked in!' : 'Checked out!'));
    } catch (e) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #6366f122', padding: 36, minWidth: 320, textAlign: 'center' }}>
        <h2 style={{ color: '#232946', fontWeight: 800, marginBottom: 18 }}>Check In / Out</h2>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#6366f1', marginBottom: 18 }}>{buildingName}</div>
        {status === 'idle' && (
          <>
            <button onClick={() => handleCheck('in')} style={{ margin: 8, padding: '12px 32px', borderRadius: 10, border: 'none', background: 'linear-gradient(90deg, #6366f1 0%, #fbcfe8 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Check In</button>
            <button onClick={() => handleCheck('out')} style={{ margin: 8, padding: '12px 32px', borderRadius: 10, border: 'none', background: 'linear-gradient(90deg, #fbcfe8 0%, #6366f1 100%)', color: '#232946', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Check Out</button>
          </>
        )}
        {status === 'loading' && <div style={{ margin: 18 }}>Processing...</div>}
        {status === 'success' && <div style={{ color: '#10b981', fontWeight: 700, margin: 18 }}>{message}</div>}
        {status === 'error' && <div style={{ color: '#ef4444', fontWeight: 700, margin: 18 }}>{message}</div>}
      </div>
    </div>
  );
}
