import type { Car } from "@/types/car";

const emptyEngine: Car["engine"] = {
  name: null, code: null, configuration: null, layout: null, cylinders: null,
  displacementCc: null, displacementL: null, aspiration: null, fuelType: "Petrol",
  compressionRatio: null, valvetrain: null, boreMm: null, strokeMm: null,
  turboPressureBar: null, enginePosition: null,
};

const emptyPerformance: Car["performance"] = {
  horsepowerHp: null, torqueNm: null, redlineRpm: null, zeroTo100Sec: null,
  zeroTo200Sec: null, quarterMileSec: null, topSpeedKmh: null,
  braking100To0M: null, weightKg: null,
};

const emptyTransmission: Car["transmission"] = {
  type: null, gears: null, drivetrain: null, differential: null,
};

const emptyDimensions: Car["dimensions"] = {
  lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null, groundClearanceMm: null,
};

const emptyChassis: Car["chassis"] = {
  frontSuspension: null, rearSuspension: null, frontBrakes: null, rearBrakes: null,
  frontTire: null, rearTire: null, wheelSize: null, steering: null,
};

const emptyFuel: Car["fuel"] = {
  fuelTankL: null, mileageKmpl: null, emissionsStandard: null,
};

const emptyPricing: Car["pricing"] = { msrpUsd: null, currentMarketValueUsd: null };

const emptyMedia: Car["media"] = {
  imageUrl: null, interiorImage: null, engineImage: null, galleryImages: null, idleSound: null, revSound: null,
};

type OptionalKeys = "designer" | "chiefEngineer" | "doors" | "seats" | "generation" | "variant" | "segment" | "bodyStyle" | "productionStatus" | "productionEnd";

type CarInput = Omit<
  Car,
  "engine" | "performance" | "transmission" | "dimensions" | "chassis" | "fuel" | "pricing" | "media" | "interestingFacts" | "timeline" | OptionalKeys
> &
  Partial<Pick<Car, OptionalKeys>> & {
    engine?: Partial<Car["engine"]>;
    performance?: Partial<Car["performance"]>;
    transmission?: Partial<Car["transmission"]>;
    dimensions?: Partial<Car["dimensions"]>;
    chassis?: Partial<Car["chassis"]>;
    fuel?: Partial<Car["fuel"]>;
    pricing?: Partial<Car["pricing"]>;
    media?: Partial<Car["media"]>;
    interestingFacts?: string[];
    timeline?: Car["timeline"];
  };

export function car(input: CarInput): Car {
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
