// Core RevEngine data model.
// Mirrors the relational schema (cars / engines / performance / transmission /
// dimensions / chassis / fuel / pricing / media / manufacturers) so this can be
// swapped for a real Postgres/Supabase-backed API layer later without touching
// any UI component. Never hardcode car data into components — always go
// through src/lib/cars.ts.

export type Aspiration =
  | "Naturally Aspirated"
  | "Single-Turbo"
  | "Twin-Turbo"
  | "Quad-Turbo"
  | "Supercharged"
  | "Electric";

export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";

export type Drivetrain = "RWD" | "FWD" | "AWD";

export type BodyStyle =
  | "Coupe"
  | "Sedan"
  | "Hatchback"
  | "Convertible"
  | "Wagon"
  | "Targa";

export type ProductionStatus = "in_production" | "discontinued" | "limited_run";

export interface EngineSpec {
  name: string | null;
  code: string | null;
  configuration: string | null;
  layout: string | null;
  cylinders: number | null;
  displacementCc: number | null;
  displacementL: number | null;
  aspiration: Aspiration | null;
  fuelType: FuelType | null;
  compressionRatio: string | null;
  valvetrain: string | null;
  boreMm: number | null;
  strokeMm: number | null;
  turboPressureBar: number | null;
  enginePosition: string | null;
}

export interface PerformanceSpec {
  horsepowerHp: number | null;
  torqueNm: number | null;
  redlineRpm: number | null;
  zeroTo100Sec: number | null;
  zeroTo200Sec: number | null;
  quarterMileSec: number | null;
  topSpeedKmh: number | null;
  braking100To0M: number | null;
  weightKg: number | null;
}

export interface TransmissionSpec {
  type: string | null;
  gears: number | null;
  drivetrain: Drivetrain | null;
  differential: string | null;
}

export interface DimensionsSpec {
  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
  wheelbaseMm: number | null;
  groundClearanceMm: number | null;
}

export interface ChassisSpec {
  frontSuspension: string | null;
  rearSuspension: string | null;
  frontBrakes: string | null;
  rearBrakes: string | null;
  frontTire: string | null;
  rearTire: string | null;
  wheelSize: string | null;
  steering: string | null;
}

export interface FuelSpec {
  fuelTankL: number | null;
  mileageKmpl: number | null;
  emissionsStandard: string | null;
}

export interface PricingSpec {
  msrpUsd: number | null;
  currentMarketValueUsd: number | null;
}

export interface MediaSpec {
  imageUrl: string | null;
  interiorImage: string | null;
  engineImage: string | null;
  galleryImages: string[] | null;
  /** Path to a .glb/.gltf 3D model, e.g. "/models/cars/01-nissan-gtr-r34.glb". */
  model3dUrl: string | null;
  idleSound: string | null;
  revSound: string | null;
}

export interface TimelineEvent {
  year: number;
  label: string;
  description?: string;
}

export interface Car {
  id: string;
  slug: string;
  manufacturerSlug: string;
  company: string;
  model: string;
  variant: string | null;
  generation: string | null;
  country: string;
  bodyStyle: BodyStyle | null;
  segment: string | null;
  productionStart: number | null;
  productionEnd: number | null;
  productionStatus: ProductionStatus | null;
  seats: number | null;
  doors: number | null;
  designer: string | null;
  chiefEngineer: string | null;
  history: string;
  interestingFacts: string[];
  timeline: TimelineEvent[];
  engine: EngineSpec;
  performance: PerformanceSpec;
  transmission: TransmissionSpec;
  dimensions: DimensionsSpec;
  chassis: ChassisSpec;
  fuel: FuelSpec;
  pricing: PricingSpec;
  media: MediaSpec;
}

export interface Manufacturer {
  slug: string;
  name: string;
  country: string;
  description: string;
  history: string | null;
  founded: number | null;
  logoUrl: string | null;
  logoInitial: string;
  website: string | null;
}
