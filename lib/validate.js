"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCar = validateCar;
exports.validateAllCars = validateAllCars;
exports.powerToWeight = powerToWeight;
// Runs the RevEngine data validation rules over the dataset. Missing values
// must be null, never 0/false/"unknown" as a stand-in — this only checks
// values that ARE present, so nulls are always allowed to pass through.
function validateCar(c) {
    const issues = [];
    const p = c.performance;
    const nonNegative = (value, field) => {
        if (value !== null && value < 0) {
            issues.push({ carId: c.id, field, message: `${field} must be >= 0, got ${value}` });
        }
    };
    nonNegative(p.horsepowerHp, "performance.horsepowerHp");
    nonNegative(p.torqueNm, "performance.torqueNm");
    nonNegative(p.zeroTo100Sec, "performance.zeroTo100Sec");
    nonNegative(p.zeroTo200Sec, "performance.zeroTo200Sec");
    nonNegative(p.topSpeedKmh, "performance.topSpeedKmh");
    if (p.weightKg !== null && p.weightKg <= 0) {
        issues.push({ carId: c.id, field: "performance.weightKg", message: `weightKg must be > 0, got ${p.weightKg}` });
    }
    if (c.productionStart !== null && c.productionEnd !== null && c.productionStart > c.productionEnd) {
        issues.push({
            carId: c.id,
            field: "productionStart/productionEnd",
            message: `productionStart (${c.productionStart}) must be <= productionEnd (${c.productionEnd})`,
        });
    }
    return issues;
}
function validateAllCars(cars) {
    return cars.flatMap(validateCar);
}
// Derived, never stored: power-to-weight in hp per metric tonne. Returns null
// whenever either input is missing rather than treating a gap as zero.
function powerToWeight(c) {
    const { horsepowerHp, weightKg } = c.performance;
    if (horsepowerHp === null || weightKg === null || weightKg === 0)
        return null;
    return Math.round((horsepowerHp / (weightKg / 1000)) * 10) / 10;
}
