// Replace this with your backend URL
const API_BASE_URL = 'http://localhost:5000/api'; //replace this with the url
// Fetch all buildings with occupancy data
export const fetchBuildings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/buildings`);
    if (!response.ok) {
      throw new Error('Failed to fetch buildings');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching buildings:', error);
    // Return dummy data if API fails
    return [
      { id: 1, name: 'Library', occupancy: 75, capacity: 100 },
      { id: 2, name: 'Quad', occupancy: 30, capacity: 50 },
      { id: 3, name: 'Law Building', occupancy: 90, capacity: 100 },
      { id: 4, name: 'Engineering', occupancy: 45, capacity: 80 },
    ];
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
        buildingName: buildingName,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check in');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking in:', error);
    // For demo purposes, still return success
    return { success: true, message: 'Check-in recorded (offline mode)' };
  }
};

// Log a checkout (optional)
export const checkOut = async (buildingName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buildingName: buildingName,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check out');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking out:', error);
    return { success: true, message: 'Check-out recorded (offline mode)' };
  }
};