import { allCars } from "@/data/cars";
import { manufacturers, getManufacturerBySlug } from "@/data/manufacturers";
import type { Car } from "@/types/car";
import { powerToWeight } from "./validate";

// Single data-access layer the whole app goes through. Nothing in components
// should import src/data directly — this is the seam where a future
// Postgres/Supabase-backed API route can be swapped in without touching UI.

export function getAllCars(): Car[] {
  return allCars;
}

export function getCarBySlug(slug: string): Car | undefined {
  return allCars.find((c) => c.slug === slug);
}

export function getCarsByManufacturer(manufacturerSlug: string): Car[] {
  return allCars.filter((c) => c.manufacturerSlug === manufacturerSlug);
}

export function getAllManufacturers() {
  return manufacturers;
}

export function getManufacturer(slug: string) {
  return getManufacturerBySlug(slug);
}

export interface CarFilters {
  manufacturers?: string[];
  countries?: string[];
  bodyStyles?: string[];
  segments?: string[];
  aspirations?: string[];
  fuelTypes?: string[];
  drivetrains?: string[];
  cylinders?: number[];
  productionStatus?: string[];
  yearMin?: number;
  yearMax?: number;
  hpMin?: number;
  hpMax?: number;
  torqueMin?: number;
  torqueMax?: number;
  zeroTo100Max?: number;
  topSpeedMin?: number;
  weightMax?: number;
  priceMax?: number;
}

export function filterCars(cars: Car[], filters: CarFilters): Car[] {
  return cars.filter((c) => {
    if (filters.manufacturers?.length && !filters.manufacturers.includes(c.manufacturerSlug)) return false;
    if (filters.countries?.length && !filters.countries.includes(c.country)) return false;
    if (filters.bodyStyles?.length && (!c.bodyStyle || !filters.bodyStyles.includes(c.bodyStyle))) return false;
    if (filters.segments?.length && (!c.segment || !filters.segments.includes(c.segment))) return false;
    if (filters.aspirations?.length && (!c.engine.aspiration || !filters.aspirations.includes(c.engine.aspiration))) return false;
    if (filters.fuelTypes?.length && (!c.engine.fuelType || !filters.fuelTypes.includes(c.engine.fuelType))) return false;
    if (filters.drivetrains?.length && (!c.transmission.drivetrain || !filters.drivetrains.includes(c.transmission.drivetrain))) return false;
    if (filters.cylinders?.length && (!c.engine.cylinders || !filters.cylinders.includes(c.engine.cylinders))) return false;
    if (filters.productionStatus?.length && (!c.productionStatus || !filters.productionStatus.includes(c.productionStatus))) return false;

    if (filters.yearMin !== undefined && (c.productionStart === null || c.productionStart < filters.yearMin)) return false;
    if (filters.yearMax !== undefined && (c.productionStart === null || c.productionStart > filters.yearMax)) return false;

    if (filters.hpMin !== undefined && (c.performance.horsepowerHp === null || c.performance.horsepowerHp < filters.hpMin)) return false;
    if (filters.hpMax !== undefined && (c.performance.horsepowerHp === null || c.performance.horsepowerHp > filters.hpMax)) return false;

    if (filters.torqueMin !== undefined && (c.performance.torqueNm === null || c.performance.torqueNm < filters.torqueMin)) return false;
    if (filters.torqueMax !== undefined && (c.performance.torqueNm === null || c.performance.torqueNm > filters.torqueMax)) return false;

    if (filters.zeroTo100Max !== undefined && (c.performance.zeroTo100Sec === null || c.performance.zeroTo100Sec > filters.zeroTo100Max)) return false;
    if (filters.topSpeedMin !== undefined && (c.performance.topSpeedKmh === null || c.performance.topSpeedKmh < filters.topSpeedMin)) return false;
    if (filters.weightMax !== undefined && (c.performance.weightKg === null || c.performance.weightKg > filters.weightMax)) return false;
    if (filters.priceMax !== undefined && (c.pricing.msrpUsd === null || c.pricing.msrpUsd > filters.priceMax)) return false;

    return true;
  });
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

// Supports partial matching across company / model / variant / generation,
// e.g. "GT-R" finds both the R34 and R35, "supra" finds MK4 and GR Supra.
export function searchCars(cars: Car[], query: string): Car[] {
  const q = normalize(query);
  if (!q) return [];
  return cars.filter((c) => {
    const haystack = normalize(
      [c.company, c.model, c.variant, c.generation, `${c.company} ${c.model}`]
        .filter(Boolean)
        .join(" ")
    );
    return haystack.includes(q);
  });
}

export type SortKey =
  | "horsepower" | "torque" | "zeroTo100" | "topSpeed" | "weight" | "year" | "manufacturer" | "powerToWeight";

export function sortCars(cars: Car[], key: SortKey, direction: "asc" | "desc" = "desc"): Car[] {
  const withValue = (c: Car): number | null => {
    switch (key) {
      case "horsepower": return c.performance.horsepowerHp;
      case "torque": return c.performance.torqueNm;
      case "zeroTo100": return c.performance.zeroTo100Sec;
      case "topSpeed": return c.performance.topSpeedKmh;
      case "weight": return c.performance.weightKg;
      case "year": return c.productionStart;
      case "powerToWeight": return powerToWeight(c);
      case "manufacturer": return null;
      default: return null;
    }
  };

  if (key === "manufacturer") {
    const sorted = [...cars].sort((a, b) => a.company.localeCompare(b.company));
    return direction === "desc" ? sorted.reverse() : sorted;
  }

  const withNulls = cars.filter((c) => withValue(c) === null);
  const withNumbers = cars.filter((c) => withValue(c) !== null);

  withNumbers.sort((a, b) => {
    const av = withValue(a) as number;
    const bv = withValue(b) as number;
    return direction === "asc" ? av - bv : bv - av;
  });

  return [...withNumbers, ...withNulls];
}

export function getLeaderboard(cars: Car[], key: SortKey, limit = 10): Car[] {
  return sortCars(cars, key, key === "zeroTo100" || key === "weight" ? "asc" : "desc").slice(0, limit);
}

// Similarity score across manufacturer, segment, engine layout, drivetrain,
// and how close horsepower/production era are. Used to compute "Similar cars"
// on a car detail page without any AI recommender, per product requirements.
export function getSimilarCars(target: Car, cars: Car[], limit = 4): Car[] {
  const candidates = cars.filter((c) => c.id !== target.id);

  const scored = candidates.map((c) => {
    let score = 0;
    if (c.manufacturerSlug === target.manufacturerSlug) score += 3;
    if (c.segment && c.segment === target.segment) score += 3;
    if (c.bodyStyle && c.bodyStyle === target.bodyStyle) score += 1;
    if (c.transmission.drivetrain && c.transmission.drivetrain === target.transmission.drivetrain) score += 2;
    if (c.engine.configuration && c.engine.configuration === target.engine.configuration) score += 2;
    if (c.country === target.country) score += 1;

    const targetHp = target.performance.horsepowerHp;
    const carHp = c.performance.horsepowerHp;
    if (targetHp !== null && carHp !== null) {
      const diff = Math.abs(targetHp - carHp);
      if (diff <= 50) score += 2;
      else if (diff <= 150) score += 1;
    }

    const targetYear = target.productionStart;
    const carYear = c.productionStart;
    if (targetYear !== null && carYear !== null && Math.abs(targetYear - carYear) <= 5) score += 1;

    return { car: c, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.car);
}

export function getFeaturedCars(cars: Car[], limit = 6): Car[] {
  return [...cars]
    .sort((a, b) => (b.performance.horsepowerHp ?? 0) - (a.performance.horsepowerHp ?? 0))
    .filter((_, i) => i % 4 === 0)
    .slice(0, limit);
}
