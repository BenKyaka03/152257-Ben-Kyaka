import { NextResponse } from 'next/server';
import { BookingRequest } from '@/app/types';
import { bookings, routes } from '@/lib/mockData';
import { generateReceiptNumber } from '@/lib/utils';

export async function POST(request: Request) {
  const body = (await request.json()) as BookingRequest;

  const route = routes.find((item) => item.id === body.routeId);
  if (!route) return NextResponse.json({ message: 'Route not found' }, { status: 404 });

  if (body.seats < 1 || body.seats > 10 || body.seats > route.availableSeats) {
    return NextResponse.json({ message: 'Invalid seat count' }, { status: 400 });
  }

  const stop = route.stops.find((item) => item.id === body.stopId);
  if (!stop) return NextResponse.json({ message: 'Stop not found' }, { status: 404 });

  route.availableSeats -= body.seats;

  const booking = {
    id: crypto.randomUUID(),
    routeId: body.routeId,
    stopId: body.stopId,
    seats: body.seats,
    totalPrice: body.seats * route.price,
    status: 'confirmed' as const,
    receiptNumber: generateReceiptNumber(),
    createdAt: body.timestamp,
    userId: body.userId
  };

  bookings.set(booking.id, booking);

  return NextResponse.json(booking, { status: 201 });
}
