import type { Car } from "@/types/car";
import SpecTable from "./SpecTable";
import { fmt, fmtCurrency, fmtYearRange } from "@/lib/format";

export function OverviewSpecs({ car }: { car: Car }) {
  return (
    <SpecTable
      title="Overview"
      rows={[
        { label: "Manufacturer", value: car.company },
        { label: "Model", value: car.model },
        { label: "Variant", value: car.variant },
        { label: "Generation", value: car.generation },
        { label: "Country", value: car.country },
        { label: "Body Style", value: car.bodyStyle },
        { label: "Segment", value: car.segment },
        { label: "Production", value: fmtYearRange(car.productionStart, car.productionEnd) },
        { label: "Seats", value: car.seats },
        { label: "Doors", value: car.doors },
        { label: "Designer", value: car.designer },
        { label: "Chief Engineer", value: car.chiefEngineer },
      ]}
    />
  );
}

export function EngineSpecs({ car }: { car: Car }) {
  const e = car.engine;
  return (
    <SpecTable
      title="Engine"
      rows={[
        { label: "Engine Name", value: e.name },
        { label: "Engine Code", value: e.code },
        { label: "Configuration", value: e.configuration },
        { label: "Layout", value: e.layout },
        { label: "Engine Position", value: e.enginePosition },
        { label: "Cylinders", value: e.cylinders },
        { label: "Displacement", value: e.displacementCc, unit: e.displacementCc ? "cc" : undefined },
        { label: "Displacement (L)", value: e.displacementL, unit: e.displacementL ? "L" : undefined },
        { label: "Aspiration", value: e.aspiration },
        { label: "Fuel Type", value: e.fuelType },
        { label: "Compression Ratio", value: e.compressionRatio },
        { label: "Valvetrain", value: e.valvetrain },
        { label: "Bore", value: e.boreMm, unit: e.boreMm ? "mm" : undefined },
        { label: "Stroke", value: e.strokeMm, unit: e.strokeMm ? "mm" : undefined },
        { label: "Turbo Pressure", value: e.turboPressureBar, unit: e.turboPressureBar ? "bar" : undefined },
      ]}
    />
  );
}

export function TransmissionSpecs({ car }: { car: Car }) {
  const t = car.transmission;
  return (
    <SpecTable
      title="Transmission & Drivetrain"
      rows={[
        { label: "Transmission Type", value: t.type },
        { label: "Gears", value: t.gears },
        { label: "Drivetrain", value: t.drivetrain },
        { label: "Differential", value: t.differential },
      ]}
    />
  );
}

export function DimensionsSpecs({ car }: { car: Car }) {
  const d = car.dimensions;
  return (
    <SpecTable
      title="Dimensions"
      rows={[
        { label: "Length", value: d.lengthMm, unit: d.lengthMm ? "mm" : undefined },
        { label: "Width", value: d.widthMm, unit: d.widthMm ? "mm" : undefined },
        { label: "Height", value: d.heightMm, unit: d.heightMm ? "mm" : undefined },
        { label: "Wheelbase", value: d.wheelbaseMm, unit: d.wheelbaseMm ? "mm" : undefined },
        { label: "Ground Clearance", value: d.groundClearanceMm, unit: d.groundClearanceMm ? "mm" : undefined },
        { label: "Kerb Weight", value: fmt(car.performance.weightKg, "kg") },
      ]}
    />
  );
}

export function ChassisSpecs({ car }: { car: Car }) {
  const c = car.chassis;
  return (
    <SpecTable
      title="Wheels, Brakes & Suspension"
      rows={[
        { label: "Front Suspension", value: c.frontSuspension },
        { label: "Rear Suspension", value: c.rearSuspension },
        { label: "Front Brakes", value: c.frontBrakes },
        { label: "Rear Brakes", value: c.rearBrakes },
        { label: "Front Tire", value: c.frontTire },
        { label: "Rear Tire", value: c.rearTire },
        { label: "Wheel Size", value: c.wheelSize },
        { label: "Steering", value: c.steering },
      ]}
    />
  );
}

export function FuelSpecs({ car }: { car: Car }) {
  const f = car.fuel;
  return (
    <SpecTable
      title="Fuel"
      rows={[
        { label: "Fuel Type", value: car.engine.fuelType },
        { label: "Fuel Tank Capacity", value: f.fuelTankL, unit: f.fuelTankL ? "L" : undefined },
        { label: "Fuel Economy", value: f.mileageKmpl, unit: f.mileageKmpl ? "km/L" : undefined },
        { label: "Emissions Standard", value: f.emissionsStandard },
      ]}
    />
  );
}

export function PricingSpecs({ car }: { car: Car }) {
  return (
    <SpecTable
      title="Pricing"
      rows={[
        { label: "MSRP (Launch)", value: fmtCurrency(car.pricing.msrpUsd) },
        { label: "Current Market Value", value: fmtCurrency(car.pricing.currentMarketValueUsd) },
      ]}
    />
  );
}
