import { Stop } from '@/app/types';

export function RouteMap({ stops, selectedStopId }: { stops: Stop[]; selectedStopId: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold">Route Map</p>
      <div className="relative flex items-center justify-between px-2">
        <div className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-blue-200" />
        {stops.map((stop) => (
          <div key={stop.id} className="group relative z-10 flex flex-col items-center">
            <div className={`h-4 w-4 rounded-full border-2 ${selectedStopId === stop.id ? 'border-blue-600 bg-blue-500' : 'border-blue-300 bg-white'}`} />
            <span className="mt-2 text-xs text-center">{stop.name}</span>
            <div className="pointer-events-none absolute -top-10 hidden rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
              {stop.time} · {stop.address}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
