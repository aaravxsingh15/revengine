"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPARISON_METRICS = void 0;
exports.getWinnerIds = getWinnerIds;
exports.getRadarAxes = getRadarAxes;
const validate_1 = require("./validate");
exports.COMPARISON_METRICS = [
    { key: "horsepower", label: "Horsepower", unit: "hp", direction: "higher_is_better", getValue: (c) => c.performance.horsepowerHp },
    { key: "torque", label: "Torque", unit: "Nm", direction: "higher_is_better", getValue: (c) => c.performance.torqueNm },
    { key: "zeroTo100", label: "0–100 km/h", unit: "s", direction: "lower_is_better", getValue: (c) => c.performance.zeroTo100Sec },
    { key: "zeroTo200", label: "0–200 km/h", unit: "s", direction: "lower_is_better", getValue: (c) => c.performance.zeroTo200Sec },
    { key: "quarterMile", label: "Quarter Mile", unit: "s", direction: "lower_is_better", getValue: (c) => c.performance.quarterMileSec },
    { key: "topSpeed", label: "Top Speed", unit: "km/h", direction: "higher_is_better", getValue: (c) => c.performance.topSpeedKmh },
    { key: "weight", label: "Weight", unit: "kg", direction: "lower_is_better", getValue: (c) => c.performance.weightKg },
    { key: "powerToWeight", label: "Power-to-Weight", unit: "hp/t", direction: "higher_is_better", getValue: (c) => (0, validate_1.powerToWeight)(c) },
    { key: "braking", label: "Braking 100–0", unit: "m", direction: "lower_is_better", getValue: (c) => c.performance.braking100To0M },
];
// Core comparison rule: null values are simply excluded from the winner
// calculation, never coerced to 0 — a car missing a spec neither wins nor
// loses that category, it just shows N/A.
function getWinnerIds(cars, metric) {
    const values = cars
        .map((c) => ({ id: c.id, value: metric.getValue(c) }))
        .filter((v) => v.value !== null);
    if (values.length === 0)
        return new Set();
    const best = metric.direction === "higher_is_better"
        ? Math.max(...values.map((v) => v.value))
        : Math.min(...values.map((v) => v.value));
    return new Set(values.filter((v) => v.value === best).map((v) => v.id));
}
function getRadarAxes(car, allInComparison) {
    const maxOf = (fn) => {
        const values = allInComparison.map(fn).filter((v) => v !== null && v > 0);
        return values.length ? Math.max(...values) : 0;
    };
    const minOf = (fn) => {
        const values = allInComparison.map(fn).filter((v) => v !== null && v > 0);
        return values.length ? Math.min(...values) : 0;
    };
    const scoreHigherBetter = (value, max) => value === null || max === 0 ? 0 : Math.round((value / max) * 100);
    const scoreLowerBetter = (value, min) => value === null || value === 0 || min === 0 ? 0 : Math.round((min / value) * 100);
    const maxHp = maxOf((c) => c.performance.horsepowerHp);
    const minZeroTo100 = minOf((c) => c.performance.zeroTo100Sec);
    const maxTopSpeed = maxOf((c) => c.performance.topSpeedKmh);
    const minWeight = minOf((c) => c.performance.weightKg);
    const maxPtw = maxOf((c) => (0, validate_1.powerToWeight)(c));
    return [
        { key: "power", label: "Power", score: scoreHigherBetter(car.performance.horsepowerHp, maxHp) },
        { key: "acceleration", label: "Acceleration", score: scoreLowerBetter(car.performance.zeroTo100Sec, minZeroTo100) },
        { key: "topSpeed", label: "Top Speed", score: scoreHigherBetter(car.performance.topSpeedKmh, maxTopSpeed) },
        { key: "weightEfficiency", label: "Weight Efficiency", score: scoreLowerBetter(car.performance.weightKg, minWeight) },
        { key: "powerToWeight", label: "Power-to-Weight", score: scoreHigherBetter((0, validate_1.powerToWeight)(car), maxPtw) },
    ];
}
