import { NextResponse } from 'next/server';
import { bookings } from '@/lib/mockData';

export async function GET(_: Request, context: { params: { id: string } }) {
  const booking = bookings.get(context.params.id);
  if (!booking) return NextResponse.json({ message: 'Booking not found' }, { status: 404 });

  return NextResponse.json({
    id: booking.id,
    receipt: booking.receiptNumber,
    status: booking.status,
    details: booking
  });
}
