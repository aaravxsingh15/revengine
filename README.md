# RevEngine

**Every Spec. Every Rev.**

RevEngine is an interactive automotive encyclopedia and car-specification comparison
platform for automobile enthusiasts — discover cars, explore full technical
specifications, compare up to four cars head-to-head, browse by manufacturer, and
build a personal garage.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Charts:** Recharts (radar comparison chart)
- **Icons:** lucide-react
- **Data:** Structured TypeScript data layer (`src/data`, `src/lib/cars.ts`) designed
  to mirror a relational schema — see [Data Architecture](#data-architecture) below.
- **Persistence:** Garage and recently-viewed cars use `localStorage` client-side
  (`src/hooks/useGarage.ts`, `src/hooks/useCompareTray.ts`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # ESLint
```

## Project Structure

```
src/
  app/                   Routes (App Router)
    cars/                Browse + car detail pages
    manufacturers/        Manufacturer listing + detail pages
    compare/              Comparison tool
    garage/                Saved cars (localStorage)
    performance/            Leaderboards
  components/
    car/                  Car cards, grids, hero, spec sections, gallery, garage UI
    compare/               Comparison table, radar chart, head-to-head, bars
    home/                  Homepage-only sections (hero showcase, leaders preview)
    manufacturer/           Manufacturer card/grid
    performance/             Leaderboard section
    layout/                  Navbar, Footer
    search/                   Global search bar
    ui/                        Reusable primitives (AnimatedNumber, StatBar, Badge, ...)
  data/
    cars/                    The 50-car seed dataset, split into 5 batches + helpers
    manufacturers.ts          The 24 manufacturers
  lib/
    cars.ts                   Data-access layer: search, filter, sort, leaderboards, similarity
    comparison.ts              Comparison engine: winner calculation, radar scoring
    validate.ts                 Data validation rules + power-to-weight calculation
    format.ts                    Display formatting helpers
  hooks/
    useGarage.ts               Garage + recently-viewed (localStorage)
    useCompareTray.ts            Cross-page "add to compare" selection tray
  types/car.ts                  Core Car / Manufacturer data model
```

## Data Architecture

**Components never hardcode car data.** Every page and component reads through
`src/lib/cars.ts`, which is the single data-access layer. Swapping the in-memory
seed dataset for a real Postgres/Supabase-backed API later only requires changing
that one file — no UI component needs to change.

The `Car` type (`src/types/car.ts`) mirrors a relational schema of separate
`engines` / `performance` / `transmission` / `dimensions` / `chassis` / `fuel` /
`pricing` / `media` tables, flattened into nested objects. Fields that aren't in
the current dataset are `null`, never fabricated or defaulted to `0`.

The current dataset ships 50 cars across 24 manufacturers, compiled from
widely-published, well-documented specifications for well-known enthusiast cars.
Core fields (horsepower, torque, 0–100, top speed, engine configuration,
production years) are filled in for essentially every car; deeper fields (exact
bore/stroke, brake rotor sizes, tire sizes, precise dimensions, current market
value) are `null` where a confident, verifiable figure wasn't available — the UI
renders these as "N/A" rather than guessing.

## Comparison Engine

`src/lib/comparison.ts` implements the winner-calculation rules:

- For each metric, `direction` is either `higher_is_better` (horsepower, torque,
  top speed, power-to-weight) or `lower_is_better` (0–100, 0–200, quarter mile,
  weight, braking distance).
- `null` values are excluded from winner calculation — never treated as `0`.
- The radar chart normalizes each axis 0–100 against the strongest car in the
  *current* comparison set (not a global constant), and is clearly labeled as a
  derived, relative score rather than an absolute rating.

## No Real Photography

There are no licensed car photos in this dataset (`media.imageUrl` is `null` for
every car). Rather than scraping or fabricating images, the UI uses an abstract
placeholder visual (`CarVisual` / `CarSilhouette`) so the product still looks
intentional. Populating `media.imageUrl` / `media.galleryImages` per car is all
that's needed to light up real photography later — no component changes required.

## What's Not Built Yet

Per the product spec, these are intentionally deferred (architecture allows for
them, but they're not implemented):

- Real 3D car models / React Three Fiber showcase
- User accounts / server-side garage persistence
- Public garage sharing, community ratings/reviews
- Engine sound integration
- An AI car recommender (explicitly out of scope by design)

## Data Disclaimer

Specifications are compiled from public manufacturer data and enthusiast press
coverage, and may vary by market, trim, and model year. This is a fan-made
reference project and is not affiliated with, endorsed by, or sponsored by any
manufacturer listed.
