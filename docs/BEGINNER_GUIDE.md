# Beginner Guide (Explain Like I’m New)

Think of this app like making a game with 3 parts:

1. **Screen part** (what users see)
2. **Brain part** (logic: totals, seat limits, eco score)
3. **Data part** (API endpoints that return routes/bookings)

## Build in tiny chunks

### Chunk 1: Make the page skeleton
- Add a header
- Add a hero section
- Add an empty booking card

Run app and make sure it still loads.

### Chunk 2: Add route data + dropdowns
- Load `/api/routes`
- Fill route dropdown
- When route changes, update stops

### Chunk 3: Seat counter + validation
- Add +/- buttons
- Keep seats between 1 and 10
- Prevent booking if seats exceed availability

### Chunk 4: Booking modal
- Show summary (route, stop, seats, total)
- Confirm button calls POST `/api/bookings`
- Show receipt number when successful

### Chunk 5: Polishing
- Add hover effects
- Add animations
- Add mobile responsiveness

---

## Debug checklist (always follow this order)

1. **Install works?** (`npm install`)
2. **Server runs?** (`npm run dev`)
3. **Page opens?** (`http://127.0.0.1:3000`)
4. **API responds?** (`curl /api/routes`)
5. **Flow works?** (book from UI)
6. **Tests pass?** (`npm run test`, `npm run build`)

If step 1 fails, do not continue to step 2.

---

## If you see the exact three errors from before

- `npm install` 403 → registry/proxy/policy issue; fix npm config/network first.
- `next: not found` → dependencies missing because install failed.
- `ERR_EMPTY_RESPONSE` in browser tool → server not running, so browser has nothing to open.

These three errors are connected in a chain.

