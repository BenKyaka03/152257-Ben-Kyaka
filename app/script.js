const STORAGE_KEYS = {
  routes: "catatu_routes",
  bookings: "catatu_bookings",
};

const defaultRoutes = [
  {
    id: crypto.randomUUID(),
    origin: "Nairobi",
    destination: "Nakuru",
    departureTime: new Date(Date.now() + 86400000).toISOString(),
    totalSeats: 36,
    price: 500,
  },
];

function load(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let routes = load(STORAGE_KEYS.routes, defaultRoutes);
let bookings = load(STORAGE_KEYS.bookings, []);

const routesEl = document.getElementById("routes");
const bookingsEl = document.getElementById("bookings");
const routeSelectEl = document.getElementById("routeSelect");
const bookingMessageEl = document.getElementById("booking-message");

function bookingsByRoute(routeId) {
  return bookings.filter((b) => b.routeId === routeId);
}

function seatsLeft(route) {
  return route.totalSeats - bookingsByRoute(route.id).length;
}

function renderRoutes() {
  routesEl.innerHTML = "";
  routeSelectEl.innerHTML = "";

  routes.forEach((route) => {
    const left = seatsLeft(route);
    const occupancy = Math.round(((route.totalSeats - left) / route.totalSeats) * 100);
    const warn = left <= 6;

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <strong>${route.origin} → ${route.destination}</strong>
      <p>${new Date(route.departureTime).toLocaleString()}</p>
      <p>Price: KSh ${route.price}</p>
      <p>Occupancy: ${occupancy}%</p>
      <span class="badge ${warn ? "warn" : "good"}">${left} seats left</span>
    `;
    routesEl.appendChild(card);

    const option = document.createElement("option");
    option.value = route.id;
    option.textContent = `${route.origin} → ${route.destination} (${left} left)`;
    routeSelectEl.appendChild(option);
  });
}

function renderBookings() {
  if (!bookings.length) {
    bookingsEl.innerHTML = "<p>No bookings yet.</p>";
    return;
  }

  const grouped = routes.map((route) => {
    const list = bookingsByRoute(route.id);
    return { route, list };
  });

  bookingsEl.innerHTML = grouped
    .map(({ route, list }) => {
      if (!list.length) return "";
      const items = list
        .map(
          (b) =>
            `<li>${b.passengerName} (${b.passengerPhone}) - seat ${b.seatNumber} - ${b.paymentStatus}</li>`,
        )
        .join("");
      return `<div class="card"><strong>${route.origin} → ${route.destination}</strong><ul>${items}</ul></div>`;
    })
    .join("");
}

function refresh() {
  save(STORAGE_KEYS.routes, routes);
  save(STORAGE_KEYS.bookings, bookings);
  renderRoutes();
  renderBookings();
}

document.getElementById("route-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const route = {
    id: crypto.randomUUID(),
    origin: document.getElementById("origin").value.trim(),
    destination: document.getElementById("destination").value.trim(),
    departureTime: new Date(document.getElementById("departureTime").value).toISOString(),
    totalSeats: Number(document.getElementById("totalSeats").value),
    price: Number(document.getElementById("price").value),
  };

  routes.unshift(route);
  event.target.reset();
  refresh();
});

document.getElementById("booking-form").addEventListener("submit", (event) => {
  event.preventDefault();
  bookingMessageEl.className = "";

  const routeId = routeSelectEl.value;
  const route = routes.find((r) => r.id === routeId);

  if (!route) {
    bookingMessageEl.textContent = "Please choose a valid route.";
    bookingMessageEl.className = "error";
    return;
  }

  const seatNumber = Number(document.getElementById("seatNumber").value);
  const taken = bookingsByRoute(routeId).some((b) => b.seatNumber === seatNumber);

  if (seatNumber < 1 || seatNumber > route.totalSeats) {
    bookingMessageEl.textContent = `Seat must be between 1 and ${route.totalSeats}.`;
    bookingMessageEl.className = "error";
    return;
  }

  if (taken) {
    bookingMessageEl.textContent = "That seat is already booked.";
    bookingMessageEl.className = "error";
    return;
  }

  if (seatsLeft(route) <= 0) {
    bookingMessageEl.textContent = "This route is full.";
    bookingMessageEl.className = "error";
    return;
  }

  bookings.unshift({
    id: crypto.randomUUID(),
    routeId,
    passengerName: document.getElementById("passengerName").value.trim(),
    passengerPhone: document.getElementById("passengerPhone").value.trim(),
    seatNumber,
    paymentStatus: "PENDING",
    createdAt: new Date().toISOString(),
  });

  event.target.reset();
  bookingMessageEl.textContent = "Seat reserved successfully.";
  bookingMessageEl.className = "success";
  refresh();
});

refresh();
