'use client';

import { Booking, Route, Stop } from '@/app/types';

interface BookingModalProps {
  open: boolean;
  route: Route;
  stop: Stop;
  seats: number;
  total: number;
  loading: boolean;
  booking?: Booking;
  onClose: () => void;
  onConfirm: () => void;
}

export function BookingModal({ open, route, stop, seats, total, onClose, onConfirm, loading, booking }: BookingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm">
      <div className="absolute bottom-0 w-full animate-slide-in rounded-t-2xl bg-white p-6 md:bottom-auto md:left-1/2 md:top-1/2 md:w-[32rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl">
        <h3 className="text-xl font-bold">Booking Summary</h3>
        <div className="mt-4 space-y-2 text-sm">
          <p><span className="font-semibold">Route:</span> {route.name}</p>
          <p><span className="font-semibold">Vehicle:</span> {route.vehicleType === 'bus' ? 'Electric Bus' : 'Electric Van'}</p>
          <p><span className="font-semibold">Stop:</span> {stop.name} ({stop.time})</p>
          <p><span className="font-semibold">Seats:</span> {seats}</p>
          <p><span className="font-semibold">Total:</span> ${total}</p>
          {booking && <p className="rounded bg-emerald-50 p-2 text-emerald-700">Confirmed ✅ Receipt: {booking.receiptNumber} (email sent simulation)</p>}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            className="min-h-11 flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading || !!booking}
          >
            {loading ? 'Processing...' : booking ? 'Confirmed' : 'Confirm & Pay'}
          </button>
          <button className="min-h-11 flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
