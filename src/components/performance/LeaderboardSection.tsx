import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { getAllCars, getLeaderboard, type SortKey } from "@/lib/cars";
import { powerToWeight } from "@/lib/validate";
import CarVisual from "@/components/ui/CarVisual";

function valueFor(car: ReturnType<typeof getAllCars>[number], key: SortKey): number | null {
  switch (key) {
    case "zeroTo100": return car.performance.zeroTo100Sec;
    case "horsepower": return car.performance.horsepowerHp;
    case "torque": return car.performance.torqueNm;
    case "topSpeed": return car.performance.topSpeedKmh;
    case "weight": return car.performance.weightKg;
    case "powerToWeight": return powerToWeight(car);
    default: return null;
  }
}

export default function LeaderboardSection({
  id,
  title,
  description,
  icon: Icon,
  metricKey,
  format,
  limit = 10,
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  metricKey: SortKey;
  format: (v: number | null) => string;
  limit?: number;
}) {
  const leaders = getLeaderboard(getAllCars(), metricKey, limit);

  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-1">
        <Icon className="w-5 h-5 text-accent" />
        <h2 className="font-display text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-muted mb-6">{description}</p>

      <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden">
        {leaders.map((car, i) => (
          <Link
            key={car.id}
            href={`/cars/${car.slug}`}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-border-subtle last:border-b-0 hover:bg-surface-2/60 transition-colors"
          >
            <span className="font-display text-lg font-bold text-muted-2 w-6 shrink-0 text-center">{i + 1}</span>
            <div className="w-16 h-11 rounded-lg overflow-hidden shrink-0">
              <CarVisual car={car} showLabel={false} className="w-full h-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-2 uppercase truncate">{car.company}</p>
              <p className="font-medium truncate">
                {car.model} {car.generation ?? car.variant ?? ""}
              </p>
            </div>
            <span className="font-display text-lg font-bold stat-number text-accent shrink-0">
              {format(valueFor(car, metricKey))}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
