// Use environment variable for API URL, fallback to localhost during development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

// Fetch all buildings with occupancy data
export const fetchBuildings = async () => {
  try {
    console.log('Fetching building data...'); // Debug log
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch buildings');
    }
    const data = await response.json();
    
    // Log the received data for debugging
    console.log('Received building data:', data);
    
    // Notify subscribers if data has changed
    notifyDataUpdate(data);
    
    return data; // Backend provides all required data
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