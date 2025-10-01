// Default building data to use when API is not ready
export const defaultBuildingsData = [
  {
    id: 'library',
    name: 'Main Library',
    occupancy: 150,
    capacity: 200,
    facilities: ['Study Areas', 'Computers', 'Printers'],
    openingHours: '8:00 AM - 10:00 PM',
    crowdedness: 75, // percentage
    count: 150,
    reviews: [],
    location: { x: 30, y: 40 }
  },
  {
    id: 'mathews',
    name: 'Mathews Building',
    occupancy: 80,
    capacity: 120,
    facilities: ['Lecture Halls', 'Computer Labs'],
    openingHours: '7:00 AM - 6:00 PM',
    crowdedness: 66, // percentage
    count: 80,
    reviews: [],
    location: { x: 45, y: 55 }
  },
  {
    id: 'scientia',
    name: 'Scientia Building',
    occupancy: 85,
    capacity: 120,
    facilities: ['Meeting Rooms', 'Auditorium'],
    openingHours: '8:00 AM - 8:00 PM',
    crowdedness: 70, // percentage
    count: 85,
    reviews: [],
    location: { x: 60, y: 35 }
  }
];