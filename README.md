# Catatu EV Booking Platform

A beginner-friendly electric vehicle booking app built with **Next.js 14 + TypeScript + Tailwind CSS**.

If you are new, don’t worry — this project is structured so you can learn while building.

---

## 1) What you are building (simple version)

Imagine this app as a digital ticket desk for electric buses and vans:

- A user opens the app.
- Picks a route.
- Picks a stop.
- Chooses how many seats.
- Confirms booking and gets a receipt.

This project also includes:

- Animated hero section
- Sticky responsive navigation
- Live seat availability colors
- Route timeline visualization
- Booking modal and receipt simulation
- API routes with mock data

---

## 2) Project structure (what each folder does)

- `app/page.tsx` → main landing page composition
- `app/components/*` → UI pieces (header, hero, booking widget, modal, map, seat counter)
- `app/api/routes/route.ts` → returns available routes
- `app/api/bookings/route.ts` → creates booking
- `app/api/bookings/[id]/route.ts` → fetches booking receipt/details
- `app/types/index.ts` → TypeScript interfaces
- `lib/mockData.ts` → in-memory route + booking data
- `lib/utils.ts` → helper logic (availability color, eco score, receipt generator)
- `tests/*` → test scaffolding

---

## 3) Beginner step-by-step build plan (start to finish)

### Step A — Setup Node.js and package manager
1. Install Node.js LTS (18+ or 20+ recommended).
2. Verify:

```bash
node -v
npm -v
```

If either command fails, reinstall Node.js.

### Step B — Install dependencies
Run:

```bash
npm install
```

This reads `package.json` and installs Next.js, React, Tailwind, Vitest, etc.

### Step C — Start the app
Run:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Then open:

- `http://localhost:3000`
- or `http://127.0.0.1:3000`

### Step D — Verify core flow manually
1. See the animated hero and “Book Your Electric Ride” CTA.
2. In booking widget, change route and stop.
3. Increase/decrease seats.
4. Click **Book Now**.
5. Confirm in modal.
6. Ensure receipt appears.

### Step E — Validate APIs
Use browser/devtools or curl:

```bash
curl http://127.0.0.1:3000/api/routes
```

```bash
curl -X POST http://127.0.0.1:3000/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{"routeId":"route-1","stopId":"stop-1","seats":2,"timestamp":"2026-01-01T10:00:00.000Z"}'
```

Then fetch booking by id:

```bash
curl http://127.0.0.1:3000/api/bookings/<BOOKING_ID>
```

### Step F — Run checks

```bash
npm run test
npm run build
npm run lint
```

If one fails, fix that layer first before continuing.

---

## 4) Error guide (important)

### ❌ Error: `npm install` returns 403
Example:

- `403 Forbidden - GET https://registry.npmjs.org/...`

This is usually **network/policy/registry** related (not your code).

Try these in order:

1. Check your current registry:
```bash
npm config get registry
```
Should be:
```text
https://registry.npmjs.org/
```

2. Force registry and retry:
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

3. Remove old lock/cache and retry:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

4. Check proxy settings (very common):
```bash
npm config get proxy
npm config get https-proxy
```
If stale/wrong:
```bash
npm config delete proxy
npm config delete https-proxy
npm install
```

5. If in corporate/school network: ask admin to allow npm registry domains.

6. Temporary fallback: try another network (hotspot) to confirm it is policy-related.

### ❌ Error: `next: not found` when running `npm run dev`
This happens when dependencies are not installed yet.

Fix:
1. Solve `npm install` first.
2. Verify Next exists:
```bash
npx next --version
```
3. Retry dev:
```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

### ⚠️ Screenshot/playwright `ERR_EMPTY_RESPONSE`
If browser tool says empty response, it means server did not start.

Fix chain:
1. Confirm install passed.
2. Start server.
3. Verify in terminal:
```bash
curl -I http://127.0.0.1:3000
```
4. Then run screenshot/e2e step.

If curl fails, browser automation will fail too.

---

## 5) Common beginner mistakes and how to avoid them

- **Mistake:** Changing too many files at once.  
  **Fix:** Change one component, test immediately.
- **Mistake:** Ignoring TypeScript errors.  
  **Fix:** Solve type errors early; they prevent runtime bugs.
- **Mistake:** Not validating API input.  
  **Fix:** Keep guard checks in POST routes (seat limits, route/stop existence).
- **Mistake:** Assuming UI bug is API bug.  
  **Fix:** Test API routes directly with curl first.

---

## 6) Suggested learning order (if you are new)

1. Read `app/page.tsx` (app composition)
2. Read `app/components/Hero.tsx` + `Header.tsx` (basic UI)
3. Read `BookingWidget.tsx` (state + user flow)
4. Read `app/api/*` (backend simulation)
5. Read `lib/utils.ts` and `app/types/index.ts` (shared logic/types)
6. Run and inspect tests

---

## 7) Scripts

```bash
npm run dev
npm run build
npm run start
npm run test
npm run test:watch
npm run lint
```

---

## 8) Deployment (optional)

Deploy to Vercel after local checks pass:

```bash
vercel
```

---

For an extra detailed child-friendly walkthrough, open: **`docs/BEGINNER_GUIDE.md`**.
