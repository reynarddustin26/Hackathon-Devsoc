const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://hackathon-dev-backend.onrender.com/api/buildings'; 

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
        buildingId: buildingName, // Backend expects buildingId
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check in');
    }
    
    const result = await response.json();
    // Fetch fresh data after check-in
    const updatedData = await fetchBuildings();
    notifyDataUpdate(updatedData);
    return result;
  } catch (error) {
    console.error('Error checking in:', error);
    return { success: false, message: 'Check-in failed' };
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
        buildingId: buildingName, // Backend expects buildingId
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check out');
    }
    
    const result = await response.json();
    // Fetch fresh data after checkout
    const updatedData = await fetchBuildings();
    notifyDataUpdate(updatedData);
    return result;
  } catch (error) {
    console.error('Error checking out:', error);
    return { success: false, message: 'Check-out failed' };
  }
};