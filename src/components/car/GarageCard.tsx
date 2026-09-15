"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { Car } from "@/types/car";
import CarVisual from "@/components/ui/CarVisual";
import { fmt, fmtDecimal, fmtYearRange } from "@/lib/format";
import { removeFromGarage } from "@/hooks/useGarage";
import { cn } from "@/lib/format";

export default function GarageCard({
  car,
  selected,
  onToggleSelect,
}: {
  car: Car;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-surface overflow-hidden transition-all",
        selected ? "border-accent ring-1 ring-accent/40" : "border-border-subtle hover:border-border-strong"
      )}
    >
      <button
        onClick={onToggleSelect}
        aria-pressed={selected}
        aria-label={selected ? "Deselect for comparison" : "Select for comparison"}
        className={cn(
          "absolute top-3 left-3 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center backdrop-blur transition-colors",
          selected ? "bg-accent border-accent" : "bg-black/40 border-white/30"
        )}
      >
        {selected && <span className="w-2.5 h-2.5 rounded-sm bg-white" />}
      </button>

      <button
        onClick={() => removeFromGarage(car.id)}
        aria-label="Remove from garage"
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <Link href={`/cars/${car.slug}`} className="block">
        <div className="aspect-[16/10]">
          <CarVisual car={car} showLabel={false} className="w-full h-full" />
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-2 uppercase truncate">{car.company}</p>
          <h3 className="font-display font-semibold truncate">
            {car.model} {car.generation && <span className="text-muted">{car.generation}</span>}
          </h3>
          <p className="text-xs text-muted mb-3">{fmtYearRange(car.productionStart, car.productionEnd)}</p>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border-subtle">
            <div>
              <p className="text-sm font-display font-semibold stat-number">{fmt(car.performance.horsepowerHp)}</p>
              <p className="text-[10px] text-muted-2 uppercase">HP</p>
            </div>
            <div>
              <p className="text-sm font-display font-semibold stat-number">{fmtDecimal(car.performance.zeroTo100Sec, "s")}</p>
              <p className="text-[10px] text-muted-2 uppercase">0-100</p>
            </div>
            <div>
              <p className="text-sm font-display font-semibold stat-number">{fmt(car.performance.topSpeedKmh)}</p>
              <p className="text-[10px] text-muted-2 uppercase">km/h</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
