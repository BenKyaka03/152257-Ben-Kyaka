import { VehicleAnimation } from './VehicleAnimation';

export function Hero() {
  return (
    <section className="bg-[length:200%_200%] bg-gradient-to-r from-blue-100 via-violet-100 to-blue-100 py-12 animate-gradient md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:grid-cols-2 md:px-8">
        <div>
          <p className="mb-3 inline-block rounded-full bg-white/70 px-4 py-1 text-sm font-semibold text-blue-600">100% Electric Mobility</p>
          <h1 className="text-4xl font-extrabold leading-tight text-gray-800 md:text-6xl">Ride Green, Save the Planet</h1>
          <p className="mt-4 text-gray-600">Book eco-friendly buses and vans with live seat updates, route previews, and instant receipts.</p>
          <a
            href="#booking"
            className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow transition hover:scale-105 hover:bg-blue-600 animate-bounce"
          >
            Book Your Electric Ride
          </a>
        </div>
        <VehicleAnimation />
      </div>
    </section>
  );
}
