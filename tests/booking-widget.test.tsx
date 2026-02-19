import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BookingWidget } from '@/app/components/BookingWidget';

describe('BookingWidget', () => {
  it('renders title', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => [
          {
            id: 'r1',
            name: 'Route',
            vehicleType: 'bus',
            price: 5,
            availableSeats: 10,
            stops: [{ id: 's1', name: 'Stop', time: '09:00', estimatedArrival: '3 min', address: 'x' }]
          }
        ]
      })
    );

    render(<BookingWidget />);
    expect(screen.getByText(/Book your EV ride/i)).toBeInTheDocument();
  });
});
