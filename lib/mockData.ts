import { Booking, Route } from '@/app/types';

export const routes: Route[] = [
  {
    id: 'route-1',
    name: 'Downtown Green Loop',
    vehicleType: 'bus',
    electric: true,
    price: 8,
    totalSeats: 40,
    availableSeats: 18,
    schedule: ['08:00', '10:00', '12:00', '16:00'],
    stops: [
      {
        id: 'stop-1',
        name: 'Central Station',
        time: '08:00',
        address: '101 Main St',
        coordinates: { lat: 40.7128, lng: -74.006 },
        estimatedArrival: '2 min'
      },
      {
        id: 'stop-2',
        name: 'Solar Park',
        time: '08:18',
        address: '22 Sun Ave',
        coordinates: { lat: 40.7138, lng: -74.001 },
        estimatedArrival: '14 min'
      },
      {
        id: 'stop-3',
        name: 'Tech District',
        time: '08:34',
        address: '450 Neon Blvd',
        coordinates: { lat: 40.718, lng: -73.998 },
        estimatedArrival: '24 min'
      }
    ]
  },
  {
    id: 'route-2',
    name: 'Campus Eco Express',
    vehicleType: 'van',
    electric: true,
    price: 6,
    totalSeats: 16,
    availableSeats: 6,
    schedule: ['09:00', '11:00', '13:00', '17:30'],
    stops: [
      {
        id: 'stop-4',
        name: 'City Mall',
        time: '09:00',
        address: '55 Market Rd',
        coordinates: { lat: 40.722, lng: -74.002 },
        estimatedArrival: '3 min'
      },
      {
        id: 'stop-5',
        name: 'Uni Gate',
        time: '09:16',
        address: '18 College St',
        coordinates: { lat: 40.728, lng: -73.996 },
        estimatedArrival: '17 min'
      },
      {
        id: 'stop-6',
        name: 'River Hostel',
        time: '09:24',
        address: '9 River Walk',
        coordinates: { lat: 40.732, lng: -73.991 },
        estimatedArrival: '25 min'
      }
    ]
  }
];

export const bookings = new Map<string, Booking>();
