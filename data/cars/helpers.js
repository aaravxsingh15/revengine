"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.car = car;
const emptyEngine = {
    name: null, code: null, configuration: null, layout: null, cylinders: null,
    displacementCc: null, displacementL: null, aspiration: null, fuelType: "Petrol",
    compressionRatio: null, valvetrain: null, boreMm: null, strokeMm: null,
    turboPressureBar: null, enginePosition: null,
};
const emptyPerformance = {
    horsepowerHp: null, torqueNm: null, redlineRpm: null, zeroTo100Sec: null,
    zeroTo200Sec: null, quarterMileSec: null, topSpeedKmh: null,
    braking100To0M: null, weightKg: null,
};
const emptyTransmission = {
    type: null, gears: null, drivetrain: null, differential: null,
};
const emptyDimensions = {
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null, groundClearanceMm: null,
};
const emptyChassis = {
    frontSuspension: null, rearSuspension: null, frontBrakes: null, rearBrakes: null,
    frontTire: null, rearTire: null, wheelSize: null, steering: null,
};
const emptyFuel = {
    fuelTankL: null, mileageKmpl: null, emissionsStandard: null,
};
const emptyPricing = { msrpUsd: null, currentMarketValueUsd: null };
const emptyMedia = {
    imageUrl: null, interiorImage: null, engineImage: null, galleryImages: null, model3dUrl: null, idleSound: null, revSound: null,
};
function car(input) {
    return {
        ...input,
        variant: input.variant ?? null,
        generation: input.generation ?? null,
        segment: input.segment ?? null,
        bodyStyle: input.bodyStyle ?? null,
        productionStatus: input.productionStatus ?? null,
        productionEnd: input.productionEnd ?? null,
        seats: input.seats ?? null,
        doors: input.doors ?? null,
        designer: input.designer ?? null,
        chiefEngineer: input.chiefEngineer ?? null,
        engine: { ...emptyEngine, ...input.engine },
        performance: { ...emptyPerformance, ...input.performance },
        transmission: { ...emptyTransmission, ...input.transmission },
        dimensions: { ...emptyDimensions, ...input.dimensions },
        chassis: { ...emptyChassis, ...input.chassis },
        fuel: { ...emptyFuel, ...input.fuel },
        pricing: { ...emptyPricing, ...input.pricing },
        media: { ...emptyMedia, ...input.media },
        interestingFacts: input.interestingFacts ?? [],
        timeline: input.timeline ?? [],
    };
}
