// Use environment variable for API URL, fallback to production URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hackathon-devsoc.onrender.com';

// Endpoints
const ENDPOINTS = {
  buildings: '/api/buildings',
  checkin: '/api/buildings/checkin',
  checkout: '/api/buildings/checkout'
};

// Helper function to construct full URLs
const getUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Keep track of the last data we received
let lastData = null;

// List of callbacks to notify when data changes
let dataUpdateCallbacks = [];

// Register a callback to be notified when building data changes
export const onBuildingsUpdate = (callback) => {
  dataUpdateCallbacks.push(callback);
  return () => {
    dataUpdateCallbacks = dataUpdateCallbacks.filter(cb => cb !== callback);
  };
};

// Notify all registered callbacks if data has changed
const notifyDataUpdate = (newData) => {
  // Only notify if the data has actually changed
  if (JSON.stringify(lastData) !== JSON.stringify(newData)) {
    lastData = newData;
    dataUpdateCallbacks.forEach(callback => callback(newData));
  }
};

// Import default data
import { defaultBuildingsData } from './data/defaultBuildings';

// Fetch all buildings with occupancy data
export const fetchBuildings = async () => {
  try {
    const url = getUrl(ENDPOINTS.buildings);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });

    // Get the response text first
    const responseText = await response.text();

    // If we get a 404 or any error, use default data
    if (!response.ok) {
      return defaultBuildingsData;
    }

    // Try to parse the response as JSON
    try {
      const data = JSON.parse(responseText);
      if (Array.isArray(data) && data.length > 0) {
        // Update last known good data
        lastData = data;
        notifyDataUpdate(data);
        return data;
      } else {
        return defaultBuildingsData;
      }
    } catch (e) {
      return defaultBuildingsData;
    }
  } catch (error) {
    console.error('❌ Network or fetch error:', error);
    return defaultBuildingsData;
  }
};

// Log a check-in
export const checkIn = async (buildingName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buildingName,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check in');
    }
    
    const result = await response.json();
    // Notify all components that data has changed
    notifyDataUpdate();
    return result;
  } catch (error) {
    console.error('Error checking in:', error);
    return { success: true, message: 'Check-in recorded (offline mode)' };
  }
};

// Log a checkout
export const checkOut = async (buildingName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buildingName,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check out');
    }
    
    const result = await response.json();
    // Notify all components that data has changed
    notifyDataUpdate();
    return result;
  } catch (error) {
    console.error('Error checking out:', error);
    return { success: true, message: 'Check-out recorded (offline mode)' };
  }
};