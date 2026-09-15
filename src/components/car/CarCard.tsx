"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, GitCompare } from "lucide-react";
import type { Car } from "@/types/car";
import CarVisual from "@/components/ui/CarVisual";
import { fmt, fmtDecimal, fmtYearRange } from "@/lib/format";
import { useGarageIds, toggleGarage } from "@/hooks/useGarage";
import { useCompareTrayIds, toggleCompareTray, MAX_COMPARE } from "@/hooks/useCompareTray";
import { cn } from "@/lib/format";

export default function CarCard({ car }: { car: Car }) {
  const garageIds = useGarageIds();
  const compareIds = useCompareTrayIds();
  const saved = garageIds.includes(car.id);
  const inCompare = compareIds.includes(car.slug);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl border border-border-subtle bg-surface overflow-hidden hover:border-border-strong hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40"
    >
      <Link href={`/cars/${car.slug}`} className="block" aria-label={`View ${car.company} ${car.model} specs`}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
            <CarVisual car={car} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
          {car.productionStatus === "in_production" && (
            <span className="absolute top-3 left-3 text-[10px] font-display font-semibold uppercase tracking-wider bg-success/15 text-success border border-success/30 rounded-full px-2 py-0.5">
              In Production
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="text-xs text-muted-2 uppercase tracking-wide truncate">{car.company}</p>
              <h3 className="font-display font-semibold text-base truncate">
                {car.model} {car.generation && <span className="text-muted">{car.generation}</span>}
                {car.variant && !car.generation && <span className="text-muted">{car.variant}</span>}
              </h3>
            </div>
            <span className="text-xs text-muted shrink-0 pt-0.5">{fmtYearRange(car.productionStart, car.productionEnd)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border-subtle">
            <Stat label="HP" value={fmt(car.performance.horsepowerHp)} />
            <Stat label="0-100" value={fmtDecimal(car.performance.zeroTo100Sec, "s")} />
            <Stat label="Top Speed" value={fmt(car.performance.topSpeedKmh, "km/h")} />
          </div>
        </div>
      </Link>

      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleGarage(car.id);
          }}
          aria-label={saved ? "Remove from garage" : "Add to garage"}
          aria-pressed={saved}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors",
            saved ? "bg-accent border-accent text-white" : "bg-black/40 border-white/10 text-white hover:bg-black/60"
          )}
        >
          <Heart className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleCompareTray(car.slug);
          }}
          aria-label={inCompare ? "Remove from comparison" : `Add to comparison (max ${MAX_COMPARE})`}
          aria-pressed={inCompare}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors",
            inCompare ? "bg-accent-2 border-accent-2 text-black" : "bg-black/40 border-white/10 text-white hover:bg-black/60"
          )}
        >
          <GitCompare className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-display font-semibold stat-number">{value}</p>
      <p className="text-[10px] text-muted-2 uppercase tracking-wide">{label}</p>
    </div>
  );
}
