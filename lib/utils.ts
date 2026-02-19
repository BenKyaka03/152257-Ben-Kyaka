import { Route } from '@/app/types';

export const getAvailabilityColor = (availableSeats: number) => {
  if (availableSeats <= 3) return 'text-red-500';
  if (availableSeats <= 10) return 'text-amber-500';
  return 'text-emerald-500';
};

export const computeEcoScore = (seats: number) => {
  const co2SavedKg = seats * 2.4;
  const treesEquivalent = Number((co2SavedKg / 21).toFixed(2));
  return { co2SavedKg, treesEquivalent };
};

export const calculateTotalPrice = (route: Route | null, seats: number) => (route ? route.price * seats : 0);

export const generateReceiptNumber = () => `EV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
