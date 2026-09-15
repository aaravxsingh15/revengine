const express = require("express");
const path = require("path");

const {
  getAllCars,
  getCarBySlug,
  getAllManufacturers,
  getManufacturer,
  getCarsByManufacturer,
  sortCars,
  filterCars,
  searchCars,
  getSimilarCars,
  getFeaturedCars,
  getLeaderboard,
} = require("./lib/cars");
const { powerToWeight } = require("./lib/validate");
const { fmt, fmtDecimal, fmtCurrency, fmtYearRange } = require("./lib/format");
const { resolveCarImages } = require("./lib/media");
const { COMPARISON_METRICS, getWinnerIds, getRadarAxes } = require("./lib/comparison");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// Serve the installed three.js package directly so car3d.js can import it
// as a real ES module without a CDN dependency or a bundler.
app.use("/vendor/three", express.static(path.join(__dirname, "node_modules/three/build")));
app.use("/vendor/three/examples", express.static(path.join(__dirname, "node_modules/three/examples/jsm")));

// Format/data helpers available to every EJS template without re-requiring
// them in each route handler.
app.use((req, res, next) => {
  res.locals.fmt = fmt;
  res.locals.fmtDecimal = fmtDecimal;
  res.locals.fmtCurrency = fmtCurrency;
  res.locals.fmtYearRange = fmtYearRange;
  res.locals.resolveCarImages = resolveCarImages;
  res.locals.powerToWeight = powerToWeight;
  res.locals.currentPath = req.path;
  next();
});

const SHOWCASE_SLUGS = [
  "nissan-gtr-r34",
  "ferrari-f40",
  "mclaren-f1",
  "bugatti-veyron-164",
  "lamborghini-aventador-svj",
  "porsche-911-gt3-992",
];
const FEATURED_SLUGS = [
  "toyota-supra-mk4",
  "porsche-carrera-gt",
  "ferrari-458-italia",
  "mclaren-720s",
  "chevrolet-corvette-c8-z06",
  "bmw-m4-g82-competition",
  "audi-r8-v10-performance",
  "ford-gt-2017",
];
const ENTHUSIAST_SLUGS = [
  "mazda-rx7-fd",
  "honda-s2000-ap2",
  "mitsubishi-lancer-evolution-ix",
  "bmw-m3-e46",
  "toyota-ae86",
  "subaru-wrx-sti-va",
  "toyota-gr86",
  "nissan-silvia-s15",
];

function pickBySlug(slugs) {
  return slugs.map((s) => getCarBySlug(s)).filter(Boolean);
}

app.get("/", (req, res) => {
  const allCars = getAllCars();
  res.render("home", {
    title: "RevEngine | Every Spec. Every Rev.",
    description:
      "RevEngine is an interactive automotive encyclopedia and car-specification comparison platform for enthusiasts.",
    allCars,
    showcaseCars: pickBySlug(SHOWCASE_SLUGS),
    featuredCars: pickBySlug(FEATURED_SLUGS),
    enthusiastCars: pickBySlug(ENTHUSIAST_SLUGS),
    manufacturers: getAllManufacturers(),
    leaderboardCategories: [
      { key: "zeroTo100", label: "Fastest 0-100", direction: "asc", unit: "s", decimals: true },
      { key: "horsepower", label: "Highest Horsepower", direction: "desc", unit: "HP" },
      { key: "topSpeed", label: "Highest Top Speed", direction: "desc", unit: "km/h" },
      { key: "weight", label: "Lightest Cars", direction: "asc", unit: "kg" },
    ],
    getLeaderboard,
  });
});

app.get("/cars", (req, res) => {
  const allCars = getAllCars();
  const q = (req.query.q || "").trim();
  const sortKey = req.query.sort || "horsepower";
  const direction = req.query.dir || (sortKey === "zeroTo100" || sortKey === "weight" ? "asc" : "desc");

  const filters = {
    manufacturers: req.query.manufacturer ? [].concat(req.query.manufacturer) : undefined,
    countries: req.query.country ? [].concat(req.query.country) : undefined,
    bodyStyles: req.query.bodyStyle ? [].concat(req.query.bodyStyle) : undefined,
    segments: req.query.segment ? [].concat(req.query.segment) : undefined,
    drivetrains: req.query.drivetrain ? [].concat(req.query.drivetrain) : undefined,
    aspirations: req.query.aspiration ? [].concat(req.query.aspiration) : undefined,
    hpMin: req.query.hpMin ? Number(req.query.hpMin) : undefined,
    hpMax: req.query.hpMax ? Number(req.query.hpMax) : undefined,
  };

  const base = q ? searchCars(allCars, q) : allCars;
  const filtered = filterCars(base, filters);
  const results = sortCars(filtered, sortKey, direction);

  const manufacturerOptions = getAllManufacturers();
  const bodyStyles = Array.from(new Set(allCars.map((c) => c.bodyStyle).filter(Boolean))).sort();
  const segments = Array.from(new Set(allCars.map((c) => c.segment).filter(Boolean))).sort();
  const countries = Array.from(new Set(allCars.map((c) => c.country))).sort();
  const drivetrains = Array.from(new Set(allCars.map((c) => c.transmission.drivetrain).filter(Boolean))).sort();

  res.render("cars", {
    title: "Browse Cars",
    description: "Search and filter every car in the RevEngine catalog.",
    cars: results,
    total: allCars.length,
    q,
    sortKey,
    direction,
    query: req.query,
    manufacturerOptions,
    bodyStyles,
    segments,
    countries,
    drivetrains,
  });
});

app.get("/cars/:slug", (req, res) => {
  const car = getCarBySlug(req.params.slug);
  if (!car) return res.status(404).render("404", { title: "Car Not Found" });

  const similarCars = getSimilarCars(car, getAllCars(), 4);

  res.render("car-detail", {
    title: `${car.company} ${car.model}${car.generation ? " " + car.generation : ""} Specifications`,
    description: `${car.company} ${car.model}: ${car.performance.horsepowerHp ?? "N/A"} hp, ${car.performance.torqueNm ?? "N/A"} Nm, 0-100 in ${car.performance.zeroTo100Sec ?? "N/A"}s.`,
    car,
    similarCars,
    gallery: resolveCarImages(car.id),
  });
});

app.get("/compare", (req, res) => {
  res.render("compare", {
    title: "Compare Cars",
    description: "Compare up to four cars head-to-head.",
    COMPARISON_METRICS_JSON: JSON.stringify(
      COMPARISON_METRICS.map((m) => ({ key: m.key, label: m.label, unit: m.unit, direction: m.direction }))
    ),
  });
});

app.get("/manufacturers", (req, res) => {
  const manufacturers = getAllManufacturers();
  const byCountry = {};
  manufacturers.forEach((m) => {
    (byCountry[m.country] = byCountry[m.country] || []).push(m);
  });
  res.render("manufacturers", {
    title: "Manufacturers",
    description: "Browse every manufacturer in the RevEngine catalog.",
    byCountry,
    getCarsByManufacturer,
  });
});

app.get("/manufacturers/:slug", (req, res) => {
  const manufacturer = getManufacturer(req.params.slug);
  if (!manufacturer) return res.status(404).render("404", { title: "Manufacturer Not Found" });

  const cars = sortCars(getCarsByManufacturer(req.params.slug), "horsepower", "desc");
  const fastestCar = sortCars(cars, "zeroTo100", "asc")[0];
  const mostPowerfulCar = cars[0];

  res.render("manufacturer-detail", {
    title: manufacturer.name,
    description: manufacturer.description,
    manufacturer,
    cars,
    fastestCar,
    mostPowerfulCar,
  });
});

app.get("/garage", (req, res) => {
  res.render("garage", {
    title: "My Garage",
    description: "Your saved cars, stored locally in your browser.",
  });
});

app.get("/performance", (req, res) => {
  const sections = [
    { id: "acceleration", title: "Fastest 0-100 km/h", key: "zeroTo100", unit: "s", decimals: true, direction: "asc" },
    { id: "horsepower", title: "Highest Horsepower", key: "horsepower", unit: "HP", direction: "desc" },
    { id: "torque", title: "Highest Torque", key: "torque", unit: "Nm", direction: "desc" },
    { id: "top-speed", title: "Highest Top Speed", key: "topSpeed", unit: "km/h", direction: "desc" },
    { id: "power-to-weight", title: "Best Power-to-Weight", key: "powerToWeight", unit: "hp/t", direction: "desc" },
    { id: "lightest", title: "Lightest Cars", key: "weight", unit: "kg", direction: "asc" },
  ];
  const cars = getAllCars();
  sections.forEach((s) => {
    s.leaders = getLeaderboard(cars, s.key, 15);
  });

  res.render("performance", {
    title: "Performance Leaderboards",
    description: "Dynamically calculated leaderboards across the RevEngine catalog.",
    sections,
  });
});

// Full dataset as JSON, consumed by client-side JS for search/filter/compare
// without a full page reload. Enriched with a resolved heroImage path so
// the browser never needs its own copy of the image-naming manifest.
app.get("/api/cars.json", (req, res) => {
  const cars = getAllCars().map((car) => {
    const images = resolveCarImages(car.id);
    return { ...car, heroImage: images ? images.hero : null };
  });
  res.json(cars);
});
app.get("/api/manufacturers.json", (req, res) => {
  res.json(getAllManufacturers());
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RevEngine running at http://localhost:${PORT}`);
});
