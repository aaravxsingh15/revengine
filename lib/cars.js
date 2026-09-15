"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCars = getAllCars;
exports.getCarBySlug = getCarBySlug;
exports.getCarsByManufacturer = getCarsByManufacturer;
exports.getAllManufacturers = getAllManufacturers;
exports.getManufacturer = getManufacturer;
exports.filterCars = filterCars;
exports.searchCars = searchCars;
exports.sortCars = sortCars;
exports.getLeaderboard = getLeaderboard;
exports.getSimilarCars = getSimilarCars;
exports.getFeaturedCars = getFeaturedCars;
const cars_1 = require("../data/cars");
const manufacturers_1 = require("../data/manufacturers");
const validate_1 = require("./validate");
// Single data-access layer the whole app goes through. Nothing in components
// should import src/data directly — this is the seam where a future
// Postgres/Supabase-backed API route can be swapped in without touching UI.
function getAllCars() {
    return cars_1.allCars;
}
function getCarBySlug(slug) {
    return cars_1.allCars.find((c) => c.slug === slug);
}
function getCarsByManufacturer(manufacturerSlug) {
    return cars_1.allCars.filter((c) => c.manufacturerSlug === manufacturerSlug);
}
function getAllManufacturers() {
    return manufacturers_1.manufacturers;
}
function getManufacturer(slug) {
    return (0, manufacturers_1.getManufacturerBySlug)(slug);
}
function filterCars(cars, filters) {
    return cars.filter((c) => {
        if (filters.manufacturers?.length && !filters.manufacturers.includes(c.manufacturerSlug))
            return false;
        if (filters.countries?.length && !filters.countries.includes(c.country))
            return false;
        if (filters.bodyStyles?.length && (!c.bodyStyle || !filters.bodyStyles.includes(c.bodyStyle)))
            return false;
        if (filters.segments?.length && (!c.segment || !filters.segments.includes(c.segment)))
            return false;
        if (filters.aspirations?.length && (!c.engine.aspiration || !filters.aspirations.includes(c.engine.aspiration)))
            return false;
        if (filters.fuelTypes?.length && (!c.engine.fuelType || !filters.fuelTypes.includes(c.engine.fuelType)))
            return false;
        if (filters.drivetrains?.length && (!c.transmission.drivetrain || !filters.drivetrains.includes(c.transmission.drivetrain)))
            return false;
        if (filters.cylinders?.length && (!c.engine.cylinders || !filters.cylinders.includes(c.engine.cylinders)))
            return false;
        if (filters.productionStatus?.length && (!c.productionStatus || !filters.productionStatus.includes(c.productionStatus)))
            return false;
        if (filters.yearMin !== undefined && (c.productionStart === null || c.productionStart < filters.yearMin))
            return false;
        if (filters.yearMax !== undefined && (c.productionStart === null || c.productionStart > filters.yearMax))
            return false;
        if (filters.hpMin !== undefined && (c.performance.horsepowerHp === null || c.performance.horsepowerHp < filters.hpMin))
            return false;
        if (filters.hpMax !== undefined && (c.performance.horsepowerHp === null || c.performance.horsepowerHp > filters.hpMax))
            return false;
        if (filters.torqueMin !== undefined && (c.performance.torqueNm === null || c.performance.torqueNm < filters.torqueMin))
            return false;
        if (filters.torqueMax !== undefined && (c.performance.torqueNm === null || c.performance.torqueNm > filters.torqueMax))
            return false;
        if (filters.zeroTo100Max !== undefined && (c.performance.zeroTo100Sec === null || c.performance.zeroTo100Sec > filters.zeroTo100Max))
            return false;
        if (filters.topSpeedMin !== undefined && (c.performance.topSpeedKmh === null || c.performance.topSpeedKmh < filters.topSpeedMin))
            return false;
        if (filters.weightMax !== undefined && (c.performance.weightKg === null || c.performance.weightKg > filters.weightMax))
            return false;
        if (filters.priceMax !== undefined && (c.pricing.msrpUsd === null || c.pricing.msrpUsd > filters.priceMax))
            return false;
        return true;
    });
}
function normalize(text) {
    return text.toLowerCase().trim();
}
// Supports partial matching across company / model / variant / generation,
// e.g. "GT-R" finds both the R34 and R35, "supra" finds MK4 and GR Supra.
function searchCars(cars, query) {
    const q = normalize(query);
    if (!q)
        return [];
    return cars.filter((c) => {
        const haystack = normalize([c.company, c.model, c.variant, c.generation, `${c.company} ${c.model}`]
            .filter(Boolean)
            .join(" "));
        return haystack.includes(q);
    });
}
function sortCars(cars, key, direction = "desc") {
    const withValue = (c) => {
        switch (key) {
            case "horsepower": return c.performance.horsepowerHp;
            case "torque": return c.performance.torqueNm;
            case "zeroTo100": return c.performance.zeroTo100Sec;
            case "topSpeed": return c.performance.topSpeedKmh;
            case "weight": return c.performance.weightKg;
            case "year": return c.productionStart;
            case "powerToWeight": return (0, validate_1.powerToWeight)(c);
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
        const av = withValue(a);
        const bv = withValue(b);
        return direction === "asc" ? av - bv : bv - av;
    });
    return [...withNumbers, ...withNulls];
}
function getLeaderboard(cars, key, limit = 10) {
    return sortCars(cars, key, key === "zeroTo100" || key === "weight" ? "asc" : "desc").slice(0, limit);
}
// Similarity score across manufacturer, segment, engine layout, drivetrain,
// and how close horsepower/production era are. Used to compute "Similar cars"
// on a car detail page without any AI recommender, per product requirements.
function getSimilarCars(target, cars, limit = 4) {
    const candidates = cars.filter((c) => c.id !== target.id);
    const scored = candidates.map((c) => {
        let score = 0;
        if (c.manufacturerSlug === target.manufacturerSlug)
            score += 3;
        if (c.segment && c.segment === target.segment)
            score += 3;
        if (c.bodyStyle && c.bodyStyle === target.bodyStyle)
            score += 1;
        if (c.transmission.drivetrain && c.transmission.drivetrain === target.transmission.drivetrain)
            score += 2;
        if (c.engine.configuration && c.engine.configuration === target.engine.configuration)
            score += 2;
        if (c.country === target.country)
            score += 1;
        const targetHp = target.performance.horsepowerHp;
        const carHp = c.performance.horsepowerHp;
        if (targetHp !== null && carHp !== null) {
            const diff = Math.abs(targetHp - carHp);
            if (diff <= 50)
                score += 2;
            else if (diff <= 150)
                score += 1;
        }
        const targetYear = target.productionStart;
        const carYear = c.productionStart;
        if (targetYear !== null && carYear !== null && Math.abs(targetYear - carYear) <= 5)
            score += 1;
        return { car: c, score };
    });
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.car);
}
function getFeaturedCars(cars, limit = 6) {
    return [...cars]
        .sort((a, b) => (b.performance.horsepowerHp ?? 0) - (a.performance.horsepowerHp ?? 0))
        .filter((_, i) => i % 4 === 0)
        .slice(0, limit);
}
