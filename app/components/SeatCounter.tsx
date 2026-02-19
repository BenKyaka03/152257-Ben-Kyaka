interface SeatCounterProps {
  seats: number;
  setSeats: (value: number) => void;
  max: number;
}

export function SeatCounter({ seats, setSeats, max }: SeatCounterProps) {
  const clickFeedback = () => navigator.vibrate?.(12);

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-700">Seats</p>
      <div className="flex items-center gap-3">
        <button
          className="min-h-11 min-w-11 rounded-lg border px-3 text-xl"
          onClick={() => {
            clickFeedback();
            setSeats(Math.max(1, seats - 1));
          }}
        >
          -
        </button>
        <div className="w-12 text-center text-xl font-bold">{seats}</div>
        <button
          className="min-h-11 min-w-11 rounded-lg border px-3 text-xl"
          onClick={() => {
            clickFeedback();
            setSeats(Math.min(max, seats + 1));
          }}
        >
          +
        </button>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1">
        {Array.from({ length: Math.min(10, max) }).map((_, i) => (
          <span key={i} className={`h-4 rounded ${i < seats ? 'bg-blue-500' : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  );
}
