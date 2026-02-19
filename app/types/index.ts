export interface Stop {
  id: string;
  name: string;
  time: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  estimatedArrival: string;
}

export interface Route {
  id: string;
  name: string;
  vehicleType: 'bus' | 'van';
  electric: boolean;
  price: number;
  stops: Stop[];
  totalSeats: number;
  availableSeats: number;
  schedule: string[];
}

export interface Booking {
  id: string;
  userId?: string;
  routeId: string;
  stopId: string;
  seats: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  receiptNumber: string;
  createdAt: string;
}

export interface BookingRequest {
  routeId: string;
  stopId: string;
  seats: number;
  userId?: string;
  timestamp: string;
}
