import type { Car } from "@/types/car";
import { COMPARISON_METRICS } from "@/lib/comparison";
import { fmt, fmtDecimal } from "@/lib/format";
import { cn } from "@/lib/format";

function formatMetric(value: number | null, unit: string): string {
  if (value === null) return "N/A";
  return unit === "s" || unit === "m" ? fmtDecimal(value, unit) : fmt(value, unit);
}

export default function HeadToHead({ carA, carB }: { carA: Car; carB: Car }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
      <div className="flex items-center justify-center gap-4 mb-8 text-center">
        <h3 className="font-display text-xl sm:text-2xl font-bold">
          {carA.company} {carA.model}
        </h3>
        <span className="font-display text-accent font-bold shrink-0">VS</span>
        <h3 className="font-display text-xl sm:text-2xl font-bold">
          {carB.company} {carB.model}
        </h3>
      </div>

      <div className="space-y-4">
        {COMPARISON_METRICS.slice(0, 6).map((metric) => {
          const a = metric.getValue(carA);
          const b = metric.getValue(carB);
          const aWins = a !== null && (b === null || (metric.direction === "higher_is_better" ? a > b : a < b));
          const bWins = b !== null && (a === null || (metric.direction === "higher_is_better" ? b > a : b < a));

          return (
            <div key={metric.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <span className={cn("text-right font-display font-semibold stat-number", aWins && "text-accent")}>
                {formatMetric(a, metric.unit)}
              </span>
              <span className="text-xs text-muted-2 uppercase tracking-wide px-2 text-center">{metric.label}</span>
              <span className={cn("text-left font-display font-semibold stat-number", bWins && "text-accent")}>
                {formatMetric(b, metric.unit)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
