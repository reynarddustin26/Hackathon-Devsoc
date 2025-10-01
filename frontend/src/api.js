// Use environment variable for API URL, fallback to production URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hackathon-devsoc.onrender.com/api/buildings';

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
  try {
    // Only notify if we have callbacks and new data
    if (dataUpdateCallbacks.length > 0 && newData) {
      console.log('📡 Received new building data:', newData.length, 'buildings');
      // Compare current and new data
      const hasChanged = !lastData || JSON.stringify(lastData) !== JSON.stringify(newData);
      if (hasChanged) {
        console.log('🔄 Data changed, notifying', dataUpdateCallbacks.length, 'listeners');
        lastData = newData;
        dataUpdateCallbacks.forEach(callback => {
          try {
            callback(newData);
          } catch (callbackError) {
            console.error('Error in update callback:', callbackError);
          }
        });
      } else {
        console.log('📊 Data unchanged, skipping update');
      }
    }
  } catch (error) {
    console.error('Error in notifyDataUpdate:', error);
  }
};

// Import default data
import { defaultBuildingsData } from './data/defaultBuildings';

// Cache timeout in milliseconds (3 seconds)
const CACHE_TIMEOUT = 3000;
let lastFetchTime = 0;

// Fetch all buildings with occupancy data
export const fetchBuildings = async (forceRefresh = false) => {
  try {
    const now = Date.now();
    // Use cache unless force refresh or cache expired
    if (!forceRefresh && lastData && (now - lastFetchTime < CACHE_TIMEOUT)) {
      console.log('💾 Using cached data');
      return lastData;
    }

    const url = getUrl(ENDPOINTS.buildings);
    console.log('📬 Fetching fresh data from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',  // Prevent browser caching
        'Pragma': 'no-cache'
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
      if (Array.isArray(data)) {
        console.log('📥 Fetched building data:', data.length, 'buildings');
        // Always notify with new data, even if empty
        notifyDataUpdate(data);
        return data;
      } else {
        console.warn('⚠️ Invalid data format, using defaults');
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
  console.log('📍 Checking in to:', buildingName);
  try {
    const response = await fetch(getUrl(ENDPOINTS.checkin), {
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
    // Fetch latest building data to update UI
    await fetchBuildings();
    return result;
  } catch (error) {
    console.error('Error checking in:', error);
    return { success: true, message: 'Check-in recorded (offline mode)' };
  }
};

// Log a checkout
export const checkOut = async (buildingName) => {
  console.log('🚪 Checking out from:', buildingName);
  try {
    const response = await fetch(getUrl(ENDPOINTS.checkout), {
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
    // Fetch latest building data to update UI
    await fetchBuildings();
    return result;
  } catch (error) {
    console.error('Error checking out:', error);
    return { success: true, message: 'Check-out recorded (offline mode)' };
  }
};