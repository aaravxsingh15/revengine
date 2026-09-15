"use client";

import Link from "next/link";
import { Heart, GitCompare } from "lucide-react";
import type { Car } from "@/types/car";
import CarVisual from "@/components/ui/CarVisual";
import Badge from "@/components/ui/Badge";
import { fmtYearRange } from "@/lib/format";
import { useGarageIds, toggleGarage } from "@/hooks/useGarage";
import { useCompareTrayIds, toggleCompareTray } from "@/hooks/useCompareTray";
import { cn } from "@/lib/format";

export default function CarHero({ car }: { car: Car }) {
  const garageIds = useGarageIds();
  const compareIds = useCompareTrayIds();
  const saved = garageIds.includes(car.id);
  const inCompare = compareIds.includes(car.slug);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-subtle carbon-texture">
      <div className="aspect-[16/9] sm:aspect-[21/9]">
        <CarVisual car={car} showLabel={false} className="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge tone="accent">{car.country}</Badge>
          {car.segment && <Badge>{car.segment}</Badge>}
          {car.productionStatus === "in_production" && <Badge tone="success">In Production</Badge>}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] mb-2">
          {car.company} {car.model}
        </h1>
        <p className="text-muted text-lg mb-6">
          {[car.generation, car.variant].filter(Boolean).join(" · ")}
          {(car.generation || car.variant) && " · "}
          {fmtYearRange(car.productionStart, car.productionEnd)}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toggleGarage(car.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all",
              saved ? "bg-accent text-white" : "bg-surface-2 border border-border-strong hover:bg-surface-3"
            )}
          >
            <Heart className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
            {saved ? "In Garage" : "Add to Garage"}
          </button>
          <button
            onClick={() => toggleCompareTray(car.slug)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all",
              inCompare ? "bg-accent-2 text-black" : "bg-surface-2 border border-border-strong hover:bg-surface-3"
            )}
          >
            <GitCompare className="w-4 h-4" />
            {inCompare ? "In Comparison" : "Add to Compare"}
          </button>
          <Link
            href={`/manufacturers/${car.manufacturerSlug}`}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-muted hover:text-foreground transition-colors"
          >
            View all {car.company} models →
          </Link>
        </div>
      </div>
    </div>
  );
}
