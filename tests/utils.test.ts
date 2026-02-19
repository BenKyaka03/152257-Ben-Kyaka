import { describe, expect, it } from 'vitest';
import { calculateTotalPrice, computeEcoScore, getAvailabilityColor } from '@/lib/utils';

describe('utils', () => {
  it('gets availability colors', () => {
    expect(getAvailabilityColor(2)).toBe('text-red-500');
    expect(getAvailabilityColor(8)).toBe('text-amber-500');
    expect(getAvailabilityColor(20)).toBe('text-emerald-500');
  });

  it('computes eco score and price', () => {
    expect(computeEcoScore(2).co2SavedKg).toBe(4.8);
    expect(calculateTotalPrice({ price: 9 } as never, 3)).toBe(27);
  });
});
