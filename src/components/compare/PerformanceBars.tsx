import type { Car } from "@/types/car";
import StatBar from "@/components/ui/StatBar";
import { fmt, fmtDecimal } from "@/lib/format";

function BarGroup({
  title,
  cars,
  getValue,
  format,
  lowerIsBetter = false,
}: {
  title: string;
  cars: Car[];
  getValue: (c: Car) => number | null;
  format: (v: number | null) => string;
  lowerIsBetter?: boolean;
}) {
  const values = cars.map(getValue).filter((v): v is number => v !== null);
  if (values.length === 0) return null;

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const best = lowerIsBetter ? minVal : maxVal;
  // For lower-is-better metrics, invert so the fastest/lightest car still
  // draws the longest bar: barScore = maxVal - actual, ranging up to the spread.
  const barMax = lowerIsBetter ? maxVal - minVal : maxVal;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6">
      <h3 className="font-display font-semibold text-sm mb-4">{title}</h3>
      <div className="space-y-4">
        {cars.map((car) => {
          const value = getValue(car);
          const barScore = value === null ? null : lowerIsBetter ? maxVal - value : value;
          return (
            <StatBar
              key={car.id}
              label={`${car.company} ${car.model}`}
              value={barScore}
              max={barMax}
              displayValue={format(value)}
              highlight={value === best}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function PerformanceBars({ cars }: { cars: Car[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <BarGroup title="Horsepower" cars={cars} getValue={(c) => c.performance.horsepowerHp} format={(v) => fmt(v, "HP")} />
      <BarGroup title="Torque" cars={cars} getValue={(c) => c.performance.torqueNm} format={(v) => fmt(v, "Nm")} />
      <BarGroup title="Top Speed" cars={cars} getValue={(c) => c.performance.topSpeedKmh} format={(v) => fmt(v, "km/h")} />
      <BarGroup
        title="0–100 km/h (lower is faster)"
        cars={cars}
        getValue={(c) => c.performance.zeroTo100Sec}
        format={(v) => fmtDecimal(v, "s")}
        lowerIsBetter
      />
    </div>
  );
}
