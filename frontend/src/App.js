import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import CheckInSuccess from './components/CheckInSuccess';
import CheckInOutPage from './components/CheckInOutPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/checkin-success" element={<CheckInSuccess />} />
          <Route path="/checkin/:id" element={<CheckInOutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;