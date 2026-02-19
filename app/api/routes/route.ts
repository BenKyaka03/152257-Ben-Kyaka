import { NextResponse } from 'next/server';
import { routes } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(
    routes.map((route) => ({
      id: route.id,
      name: route.name,
      vehicle: route.vehicleType === 'bus' ? 'Electric Bus' : 'Electric Van',
      price: route.price,
      stops: route.stops.map((stop) => ({
        id: stop.id,
        name: stop.name,
        time: stop.time,
        lat: stop.coordinates.lat,
        lng: stop.coordinates.lng
      })),
      vehicleType: route.vehicleType,
      electric: route.electric,
      totalSeats: route.totalSeats,
      availableSeats: route.availableSeats,
      schedule: route.schedule
    }))
  );
}
