'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaBus, FaVanShuttle } from 'react-icons/fa6';
import { Booking, Route } from '@/app/types';
import { calculateTotalPrice, computeEcoScore, getAvailabilityColor } from '@/lib/utils';
import { SeatCounter } from './SeatCounter';
import { RouteMap } from './RouteMap';
import { BookingModal } from './BookingModal';

export function BookingWidget() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedStopId, setSelectedStopId] = useState('');
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | undefined>();

  useEffect(() => {
    fetch('/api/routes')
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data);
        if (data[0]) {
          setSelectedRouteId(data[0].id);
          setSelectedStopId(data[0].stops[0]?.id ?? '');
        }
      })
      .catch(() => setError('Could not load routes. Please retry.'));
  }, []);

  const selectedRoute = useMemo(() => routes.find((route) => route.id === selectedRouteId) ?? null, [routes, selectedRouteId]);
  const selectedStop = selectedRoute?.stops.find((stop) => stop.id === selectedStopId);
  const total = calculateTotalPrice(selectedRoute, seats);
  const eco = computeEcoScore(seats);

  const remaining = (selectedRoute?.availableSeats ?? 0) - seats;

  const onBook = async () => {
    if (!selectedRoute || !selectedStop || seats < 1 || remaining < 0) {
      setError('Please choose valid route/stop and seats.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routeId: selectedRoute.id,
          stopId: selectedStop.id,
          seats,
          timestamp: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setBooking(created);
    } catch {
      setError('Booking failed due to network issue. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:scale-[1.01]">
        <h2 className="text-3xl font-bold">Book your EV ride</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Choose Route</span>
              <select
                className="min-h-11 w-full rounded-lg border px-3 py-2"
                value={selectedRouteId}
                onChange={(e) => {
                  setSelectedRouteId(e.target.value);
                  const next = routes.find((route) => route.id === e.target.value);
                  setSelectedStopId(next?.stops[0]?.id ?? '');
                  setBooking(undefined);
                }}
              >
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.vehicleType === 'bus' ? '🚌' : '🚐'} {route.name}
                  </option>
                ))}
              </select>
            </label>

            {selectedRoute && (
              <p className="flex items-center gap-2 text-sm">
                {selectedRoute.vehicleType === 'bus' ? <FaBus /> : <FaVanShuttle />} 
                {selectedRoute.vehicleType === 'bus' ? 'Electric Bus' : 'Electric Van'} • ${selectedRoute.price}/seat
              </p>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Pick Stop</span>
              <select className="min-h-11 w-full rounded-lg border px-3 py-2" value={selectedStopId} onChange={(e) => setSelectedStopId(e.target.value)}>
                {selectedRoute?.stops.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name} ({stop.time})
                  </option>
                ))}
              </select>
            </label>

            <SeatCounter seats={seats} setSeats={setSeats} max={Math.min(10, selectedRoute?.availableSeats ?? 10)} />

            <p className={`font-semibold ${getAvailabilityColor(remaining)} animate-pulse-slow`}>
              Live seats remaining: {Math.max(0, remaining)}
            </p>
            <p className="text-sm text-gray-600">Eco score: {eco.co2SavedKg}kg CO₂ saved • {eco.treesEquivalent} trees equivalent 🌳</p>

            {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

            <button
              className="min-h-11 w-full rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 font-semibold text-white transition hover:from-violet-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setOpenModal(true)}
              disabled={!selectedRoute || !selectedStop || remaining < 0}
            >
              Book Now
            </button>
          </div>

          <div className="space-y-4">
            <RouteMap stops={selectedRoute?.stops ?? []} selectedStopId={selectedStopId} />
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">Live Vehicle Tracking (simulated)</p>
              <div className="mt-3 h-2 w-full rounded-full bg-blue-100">
                <div className="h-2 w-1/2 animate-pulse rounded-full bg-blue-500" />
              </div>
              <p className="mt-2 text-xs text-gray-500">ETA: {selectedStop?.estimatedArrival ?? '--'}</p>
            </div>
          </div>
        </div>
      </div>

      {selectedRoute && selectedStop && (
        <BookingModal
          open={openModal}
          route={selectedRoute}
          stop={selectedStop}
          seats={seats}
          total={total}
          loading={loading}
          booking={booking}
          onConfirm={onBook}
          onClose={() => setOpenModal(false)}
        />
      )}
    </section>
  );
}
