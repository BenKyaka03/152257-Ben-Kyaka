# CATATU – Phase 0 Starter Repository

This repository contains a **Phase 0 MVP** starter for CATATU.

Phase 0 is intentionally lean and focused on one outcome:

> Fill seats consistently by making booking simple, trackable, and fast.

## What is included

- A beginner-friendly, browser-based app (works on Android, iOS, Windows, Mac via any modern browser).
- A guided implementation plan with weekly milestones.
- A CFO-oriented ESOP/capital-call decision memo for your current stage.

## Phase 0 features in this repo

- Route catalog view
- Seat availability indicators
- Passenger reservation form
- Basic admin panel (add route + view bookings)
- Local persistence with `localStorage`

> Note: This is a pre-production starter. Move to a real backend (Next.js + PostgreSQL + Prisma) in Phase 1.

## Run locally

Because this starter uses plain HTML/CSS/JS, you can run it without package installs:

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080/app/index.html`

## Suggested next step after Phase 0

When your occupancy is consistently above your break-even target, migrate this same flow to:

- Next.js App Router
- PostgreSQL + Prisma
- Auth + payment integration

See `docs/phase-0-plan.md` for the full path.
