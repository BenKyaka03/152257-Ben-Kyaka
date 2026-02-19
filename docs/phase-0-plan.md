# CATATU Phase 0 Plan (Beginner-Friendly)

## Objective
Build a clean MVP that helps the team:

1. Publish routes quickly.
2. Collect reservations quickly.
3. Measure occupancy by route and departure time.

## Success criteria for Phase 0

- A user can see route, departure time, and seats left.
- A user can reserve a seat in under 2 minutes.
- Admin can add a route in under 1 minute.
- Team can export or copy bookings for bus boarding.

## Scope (keep this strict)

### In scope
- Route management
- Seat count tracking
- Reservation capture
- Daily occupancy visibility

### Out of scope (Phase 1+)
- STK push automation
- Real-time GPS tracking
- Dynamic pricing
- Multi-tenant enterprise controls

## Build steps

### Step 1: Define one real route
Use real values for:
- Origin
- Destination
- Departure date and time
- Ticket price
- Total seats

### Step 2: Run the app from this repo
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080/app/index.html`.

### Step 3: Add Wednesday campaign route
In **Admin Panel**:
- Add your Wednesday 8:30 PM route.
- Set seats to 36.

### Step 4: Fill seats via campaign
Use your 11-person marketing team with direct targets:
- Minimum 4 confirmed bookings per member.
- Update progress every 6 hours.

### Step 5: Daily KPI tracking
Track these numbers each day:
- Seats listed
- Seats booked
- Occupancy %
- No-shows

Formula:

```text
Occupancy % = (Booked seats / Total seats) * 100
```

### Step 6: Phase 0 completion
You complete Phase 0 when for at least 2 consecutive weeks:
- Occupancy reaches your break-even threshold.
- Booking data is captured consistently.
- Team can reliably operate with the app.

## Data fields to capture now

### Route
- id
- origin
- destination
- departureTime
- totalSeats
- price

### Booking
- id
- routeId
- passengerName
- passengerPhone
- seatNumber
- paymentStatus
- createdAt

## Upgrade plan (Phase 1)
When Phase 0 is stable:
- Add Next.js + PostgreSQL backend
- Add role-based auth
- Add payment and confirmations
- Add analytics dashboard
