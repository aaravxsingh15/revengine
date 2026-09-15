import { Gauge, Zap, Timer, ArrowUpRight, Weight, Activity, Flag, RotateCw } from "lucide-react";
import type { Car } from "@/types/car";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import StatBar from "@/components/ui/StatBar";
import { powerToWeight } from "@/lib/validate";
import { getAllCars } from "@/lib/cars";
import { fmt } from "@/lib/format";

const CARDS: {
  key: keyof Car["performance"] | "powerToWeight";
  label: string;
  unit: string;
  icon: typeof Gauge;
  decimals?: number;
}[] = [
  { key: "horsepowerHp", label: "Horsepower", unit: "HP", icon: Gauge },
  { key: "torqueNm", label: "Torque", unit: "Nm", icon: Zap },
  { key: "zeroTo100Sec", label: "0–100 km/h", unit: "s", icon: Timer, decimals: 1 },
  { key: "zeroTo200Sec", label: "0–200 km/h", unit: "s", icon: Timer, decimals: 1 },
  { key: "quarterMileSec", label: "Quarter Mile", unit: "s", icon: Flag, decimals: 1 },
  { key: "topSpeedKmh", label: "Top Speed", unit: "km/h", icon: ArrowUpRight },
  { key: "weightKg", label: "Weight", unit: "kg", icon: Weight },
  { key: "powerToWeight", label: "Power-to-Weight", unit: "hp/t", icon: Activity },
];

export default function PerformanceDashboard({ car }: { car: Car }) {
  const allCars = getAllCars();
  const maxOf = (fn: (c: Car) => number | null) =>
    Math.max(...allCars.map(fn).filter((v): v is number => v !== null));

  const maxHp = maxOf((c) => c.performance.horsepowerHp);
  const maxTorque = maxOf((c) => c.performance.torqueNm);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {CARDS.map(({ key, label, unit, icon: Icon, decimals }) => {
          const value = key === "powerToWeight" ? powerToWeight(car) : car.performance[key];
          return (
            <div
              key={key}
              className="rounded-2xl border border-border-subtle bg-surface p-5 hover:border-accent/30 transition-colors"
            >
              <Icon className="w-4 h-4 text-accent mb-3" />
              <p className="font-display text-2xl sm:text-3xl font-bold stat-number">
                <AnimatedNumber value={value} decimals={decimals ?? 0} suffix={value !== null ? ` ${unit}` : ""} />
              </p>
              <p className="text-xs text-muted uppercase tracking-wide mt-1">{label}</p>
            </div>
          );
        })}
        {car.performance.redlineRpm !== null && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-5 hover:border-accent/30 transition-colors">
            <RotateCw className="w-4 h-4 text-accent mb-3" />
            <p className="font-display text-2xl sm:text-3xl font-bold stat-number">
              <AnimatedNumber value={car.performance.redlineRpm} suffix=" RPM" />
            </p>
            <p className="text-xs text-muted uppercase tracking-wide mt-1">Redline</p>
          </div>
        )}
        {car.performance.braking100To0M !== null && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-5 hover:border-accent/30 transition-colors">
            <Activity className="w-4 h-4 text-accent mb-3" />
            <p className="font-display text-2xl sm:text-3xl font-bold stat-number">
              <AnimatedNumber value={car.performance.braking100To0M} decimals={1} suffix=" m" />
            </p>
            <p className="text-xs text-muted uppercase tracking-wide mt-1">Braking 100–0</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface p-6 space-y-5">
        <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-muted mb-1">
          Relative to the RevEngine Database
        </h3>
        <StatBar label="Horsepower" value={car.performance.horsepowerHp} max={maxHp} displayValue={fmt(car.performance.horsepowerHp, "HP")} highlight />
        <StatBar label="Torque" value={car.performance.torqueNm} max={maxTorque} displayValue={fmt(car.performance.torqueNm, "Nm")} accent="accent-2" highlight />
      </div>
    </div>
  );
}
