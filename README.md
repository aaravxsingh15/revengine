# RevEngine

**Every Spec. Every Rev.**

RevEngine is an interactive automotive encyclopedia and car-specification comparison
platform for automobile enthusiasts — discover cars, explore full technical
specifications, compare up to four cars head-to-head, browse by manufacturer, and
build a personal garage.

## Tech Stack

Plain HTML/CSS/JS on the front end — no React, no build step, no bundler.

- **Server:** Node.js + Express
- **Templating:** EJS (server-rendered pages)
- **Styling:** Hand-written CSS (`public/css/style.css`) — no framework
- **Client interactivity:** Vanilla JavaScript, plain `<script>` tags (`public/js/`)
- **3D:** Three.js, loaded as a real ES module served straight from `node_modules`
  (no CDN, no bundler) — see `public/js/car3d.js`
- **Data:** Plain JS modules (`data/`, `lib/`) mirroring a relational schema — see
  [Data Architecture](#data-architecture) below
- **Persistence:** Garage and recently-viewed cars use `localStorage` client-side
  (`public/js/garage.js`, `public/js/compare-tray.js`)

## Getting Started

```bash
npm install
npm start        # node server.js
# or, for auto-restart on file changes:
npm run dev       # node --watch server.js
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
server.js                   Express app: all routes, EJS rendering, JSON API
data/
  cars/                      The 50-car seed dataset (batch1-5.js + helpers.js + index.js)
  manufacturers.js           The 23 manufacturers
  imageManifest.js           car_id -> conventional /images/cars/... paths (see below)
lib/
  cars.js                    Data-access layer: search, filter, sort, leaderboards, similarity
  comparison.js              Comparison engine: winner calculation, radar scoring
  validate.js                 Data validation rules + power-to-weight calculation
  format.js                    Display formatting helpers
  media.js                     Resolves conventional image paths per car
views/
  partials/                  head, nav, footer, car-card, car-silhouette (shared EJS includes)
  home.ejs, cars.ejs, car-detail.ejs, compare.ejs, manufacturers.ejs,
  manufacturer-detail.ejs, garage.ejs, performance.ejs, 404.ejs
public/
  css/style.css               The entire design system, hand-written
  js/                          silhouette.js, format.js, garage.js, compare-tray.js,
                                cards.js, search.js, main.js, hero.js, browse.js,
                                car-detail.js, compare.js, garage-page.js,
                                recently-viewed.js, car3d.js
  images/cars/                 Where real photos go (empty — see image-sourcing/)
image-sourcing/                License-tracking CSV + naming convention docs
```

## Data Architecture

**Views never hardcode car data.** Every route in `server.js` reads through
`lib/cars.js`, the single data-access layer, and passes plain data into EJS
templates. Swapping the in-memory seed dataset for a real Postgres/Supabase-backed
API later only requires changing `lib/cars.js` — no view needs to change.

Car records (`data/cars/*.js`) mirror a relational schema of separate
`engines` / `performance` / `transmission` / `dimensions` / `chassis` / `fuel` /
`pricing` / `media` objects, flattened into nested fields. Fields that aren't in
the current dataset are `null`, never fabricated or defaulted to `0`.

The current dataset ships 50 cars across 23 manufacturers, compiled from
widely-published, well-documented specifications for well-known enthusiast cars.
Core fields (horsepower, torque, 0–100, top speed, engine configuration,
production years) are filled in for essentially every car; deeper fields (exact
bore/stroke, brake rotor sizes, tire sizes, precise dimensions, current market
value) are `null` where a confident, verifiable figure wasn't available — the UI
renders these as "N/A" rather than guessing.

## Comparison Engine

`lib/comparison.js` implements the winner-calculation rules (mirrored in
`public/js/compare.js` for the client-rendered comparison page):

- For each metric, `direction` is either `higher_is_better` (horsepower, torque,
  top speed, power-to-weight) or `lower_is_better` (0–100, 0–200, quarter mile,
  weight, braking distance).
- `null` values are excluded from winner calculation — never treated as `0`.
- The radar chart (hand-drawn SVG, no charting library) normalizes each axis
  0–100 against the strongest car in the *current* comparison set, and is
  clearly labeled as a derived, relative score rather than an absolute rating.

## Real Photography

No licensed car photos ship in this repo — scraping or bulk-downloading press
photography isn't something to redistribute without a license. Instead,
`data/imageManifest.js` defines a conventional path per car
(`public/images/cars/<folder>/<file>.jpg`, 9 slots: hero + front/rear/side/
interior/dashboard/engine/wheels/detail), generated from the naming/license
package in `image-sourcing/`. Every path currently 404s; drop a real,
properly-licensed photo at the exact path and it renders automatically — every
`<img>` on the site fails over to the original SVG line-art artwork on load
error, so a missing photo never shows a broken-image icon.

## Real 3D Models

`public/js/car3d.js` renders an actual `.glb`/`.gltf` model with Three.js
(drag-to-orbit, auto-rotate, studio lighting) whenever a car's
`media.model3dUrl` is set. No model file ships in this repo. A missing or
broken model falls back to the same 2D artwork/photo system, so this is purely
additive — safe to leave unset for any car.

## What's Not Built Yet

Per the product spec, these are intentionally deferred (architecture allows for
them, but they're not implemented):

- User accounts / server-side garage persistence
- Public garage sharing, community ratings/reviews
- Engine sound integration
- An AI car recommender (explicitly out of scope by design)

## Data Disclaimer

Specifications are compiled from public manufacturer data and enthusiast press
coverage, and may vary by market, trim, and model year. This is a fan-made
reference project and is not affiliated with, endorsed by, or sponsored by any
manufacturer listed.
