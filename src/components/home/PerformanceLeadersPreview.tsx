import Link from "next/link";
import { Zap, Gauge, ArrowUpRight, Feather } from "lucide-react";
import { getAllCars, getLeaderboard, type SortKey } from "@/lib/cars";
import { fmt, fmtDecimal } from "@/lib/format";

const CATEGORIES: { key: SortKey; label: string; icon: typeof Zap; format: (v: number | null) => string }[] = [
  { key: "zeroTo100", label: "Fastest 0–100", icon: Zap, format: (v) => fmtDecimal(v, "s") },
  { key: "horsepower", label: "Highest Horsepower", icon: Gauge, format: (v) => fmt(v, "hp") },
  { key: "topSpeed", label: "Highest Top Speed", icon: ArrowUpRight, format: (v) => fmt(v, "km/h") },
  { key: "weight", label: "Lightest Cars", icon: Feather, format: (v) => fmt(v, "kg") },
];

function valueFor(car: ReturnType<typeof getAllCars>[number], key: SortKey): number | null {
  switch (key) {
    case "zeroTo100": return car.performance.zeroTo100Sec;
    case "horsepower": return car.performance.horsepowerHp;
    case "topSpeed": return car.performance.topSpeedKmh;
    case "weight": return car.performance.weightKg;
    default: return null;
  }
}

export default function PerformanceLeadersPreview() {
  const cars = getAllCars();

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {CATEGORIES.map(({ key, label, icon: Icon, format }) => {
        const leaders = getLeaderboard(cars, key, 5);
        return (
          <div key={key} className="rounded-2xl border border-border-subtle bg-surface p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-4 h-4 text-accent" />
              <h3 className="font-display font-semibold text-sm">{label}</h3>
            </div>
            <ol className="space-y-3">
              {leaders.map((car, i) => (
                <li key={car.id}>
                  <Link href={`/cars/${car.slug}`} className="flex items-center gap-3 group">
                    <span className="font-display text-xs text-muted-2 w-4 shrink-0">{i + 1}</span>
                    <span className="text-sm truncate flex-1 group-hover:text-accent transition-colors">
                      {car.company} {car.model}
                    </span>
                    <span className="text-sm font-display font-semibold stat-number shrink-0">{format(valueFor(car, key))}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
