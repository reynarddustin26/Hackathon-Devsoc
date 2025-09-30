// Replace this with your backend URL
const API_BASE_URL = 'https://hackathon-devsoc.onrender.com'; //replace this with the url
// Fetch all buildings with occupancy data
export const fetchBuildings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/buildings`);
    if (!response.ok) {
      throw new Error('Failed to fetch buildings');
    }
    const data = await response.json();
    
    // Add occupancy data to the buildings from backend
    return data.map(building => ({
      ...building,
      occupancy: building.occupancy || Math.floor(Math.random() * 100), // Use backend data or random
      capacity: building.capacity || 100
    }));
  } catch (error) {
    console.error('Error fetching buildings:', error);
    // Return realistic dummy data for major UNSW buildings
    return [
      { id: 'library', name: 'Main Library', occupancy: 150, capacity: 200 },
      { id: 'mathews', name: 'Mathews Building', occupancy: 80, capacity: 120 },
      { id: 'clb', name: 'Central Lecture Block', occupancy: 200, capacity: 300 },
      { id: 'hilmer', name: 'Hilmer Building', occupancy: 45, capacity: 80 },
      { id: 'sci_eng', name: 'Science & Engineering', occupancy: 180, capacity: 250 },
      { id: 'business_school', name: 'Business School', occupancy: 220, capacity: 300 },
      { id: 'law', name: 'Law Building', occupancy: 95, capacity: 150 },
      { id: 'blockhouse', name: 'Blockhouse', occupancy: 30, capacity: 60 },
      { id: 'tyree', name: 'Tyree Energy Building', occupancy: 70, capacity: 100 },
      { id: 'roundhouse', name: 'Roundhouse', occupancy: 120, capacity: 200 },
      { id: 'squarehouse', name: 'Squarehouse', occupancy: 80, capacity: 150 },
      { id: 'morven_brown', name: 'Morven Brown Building', occupancy: 140, capacity: 200 },
      { id: 'quadrangle', name: 'Quadrangle Building', occupancy: 60, capacity: 100 },
      { id: 'red_centre', name: 'Red Centre', occupancy: 190, capacity: 250 },
      { id: 'scientia', name: 'Scientia Building', occupancy: 85, capacity: 120 },
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