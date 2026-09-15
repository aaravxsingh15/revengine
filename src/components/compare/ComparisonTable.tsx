import type { Car } from "@/types/car";
import { COMPARISON_METRICS, getWinnerIds } from "@/lib/comparison";
import { fmt, fmtDecimal, fmtCurrency, fmtYearRange } from "@/lib/format";
import { cn } from "@/lib/format";

interface InfoRow {
  label: string;
  getValue: (c: Car) => string;
}

const INFO_ROWS: InfoRow[] = [
  { label: "Manufacturer", getValue: (c) => c.company },
  { label: "Model", getValue: (c) => [c.model, c.generation, c.variant].filter(Boolean).join(" ") },
  { label: "Production Years", getValue: (c) => fmtYearRange(c.productionStart, c.productionEnd) },
  { label: "Country", getValue: (c) => c.country },
  { label: "Engine", getValue: (c) => c.engine.name ?? c.engine.configuration ?? "N/A" },
  { label: "Configuration", getValue: (c) => c.engine.configuration ?? "N/A" },
  { label: "Aspiration", getValue: (c) => c.engine.aspiration ?? "N/A" },
  { label: "Displacement", getValue: (c) => (c.engine.displacementL ? `${c.engine.displacementL}L` : "N/A") },
  { label: "Cylinders", getValue: (c) => (c.engine.cylinders ? String(c.engine.cylinders) : "N/A") },
  { label: "Transmission", getValue: (c) => c.transmission.type ?? "N/A" },
  { label: "Gears", getValue: (c) => (c.transmission.gears ? String(c.transmission.gears) : "N/A") },
  { label: "Drivetrain", getValue: (c) => c.transmission.drivetrain ?? "N/A" },
  { label: "Fuel Type", getValue: (c) => c.engine.fuelType ?? "N/A" },
  { label: "MSRP", getValue: (c) => fmtCurrency(c.pricing.msrpUsd) },
  { label: "Current Market Value", getValue: (c) => fmtCurrency(c.pricing.currentMarketValueUsd) },
];

function formatMetricValue(value: number | null, unit: string): string {
  if (value === null) return "N/A";
  if (unit === "s" || unit === "m") return fmtDecimal(value, unit);
  return fmt(value, unit);
}

export default function ComparisonTable({ cars }: { cars: Car[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left p-4 font-display text-xs uppercase tracking-wide text-muted-2 sticky left-0 bg-surface">
              Spec
            </th>
            {cars.map((car) => (
              <th key={car.id} className="text-left p-4 min-w-[160px]">
                <p className="text-xs text-muted-2 uppercase">{car.company}</p>
                <p className="font-display font-semibold">{car.model}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={cars.length + 1} className="px-4 pt-5 pb-2 text-xs font-display font-semibold uppercase tracking-wider text-accent">
              Overview
            </td>
          </tr>
          {INFO_ROWS.map((row, i) => (
            <tr key={row.label} className={cn("border-b border-border-subtle/50", i % 2 === 1 && "bg-surface-2/30")}>
              <td className="p-4 text-muted sticky left-0 bg-surface">{row.label}</td>
              {cars.map((car) => (
                <td key={car.id} className="p-4 font-medium">
                  {row.getValue(car)}
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td colSpan={cars.length + 1} className="px-4 pt-6 pb-2 text-xs font-display font-semibold uppercase tracking-wider text-accent">
              Performance
            </td>
          </tr>
          {COMPARISON_METRICS.map((metric, i) => {
            const winners = getWinnerIds(cars, metric);
            return (
              <tr key={metric.key} className={cn("border-b border-border-subtle/50", i % 2 === 1 && "bg-surface-2/30")}>
                <td className="p-4 text-muted sticky left-0 bg-surface">
                  {metric.label} <span className="text-muted-2">({metric.unit})</span>
                </td>
                {cars.map((car) => {
                  const value = metric.getValue(car);
                  const isWinner = winners.has(car.id);
                  return (
                    <td
                      key={car.id}
                      className={cn("p-4 font-display font-semibold stat-number", isWinner && "text-accent")}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {formatMetricValue(value, metric.unit)}
                        {isWinner && <span className="text-[10px] rounded-full bg-accent/15 text-accent px-1.5 py-0.5 font-sans font-semibold">BEST</span>}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
