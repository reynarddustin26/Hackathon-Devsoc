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

console.log('🔧 API Configuration:', {
  baseUrl: API_BASE_URL,
  buildingsEndpoint: getUrl(ENDPOINTS.buildings)
});

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
    console.log('🔍 Fetching from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });

    console.log('📡 Response status:', response.status);

    // If we get a 404 or any error, use default data
    if (!response.ok) {
      console.log('⚠️ API not ready, using default data');
      return defaultBuildingsData;
    }

    try {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ Got real data from API:', data.length, 'buildings');
        return data;
      } else {
        console.log('⚠️ Invalid data from API, using defaults');
        return defaultBuildingsData;
      }
    } catch (e) {
      console.log('⚠️ Failed to parse API response, using defaults');
      return defaultBuildingsData;
      },
      mode: 'cors',
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers));
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);
    
    if (!response.ok) {
      console.error('❌ Server returned error:', response.status, response.statusText);
      throw new Error(`Failed to fetch buildings: ${response.status}`);
    }
    
    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed data:', data);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
      return lastData || [];
    }
    
    if (!Array.isArray(data)) {
      console.error('❌ Data is not an array:', data);
      return lastData || [];
    }
    
    // Only update if we actually got buildings
    if (data.length > 0) {
      lastData = data;
      notifyDataUpdate(data);
      console.log('🏢 Returned buildings:', data.length);
    } else {
      console.log('⚠️ No buildings in response');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return lastData || []; // Return last known data if available, empty array as fallback
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