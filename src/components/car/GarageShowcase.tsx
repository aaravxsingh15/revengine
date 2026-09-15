"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, GitCompare, Trash2 } from "lucide-react";
import type { Car } from "@/types/car";
import CarSilhouette from "@/components/ui/CarSilhouette";
import CarVisual from "@/components/ui/CarVisual";
import PerformanceDashboard from "@/components/car/PerformanceDashboard";
import Badge from "@/components/ui/Badge";
import { fmtYearRange, cn } from "@/lib/format";
import { removeFromGarage } from "@/hooks/useGarage";
import { toggleCompareTray } from "@/hooks/useCompareTray";

// The garage's hero moment: pick any saved car from the strip below and it
// rolls into the showcase (same wheel-rolling entrance as the homepage hero),
// with its full performance dashboard shown right underneath.
export default function GarageShowcase({ cars }: { cars: Car[] }) {
  // No effect needed to "reset" this when a car is removed from the garage —
  // falling back to cars[0] on every render handles that for free.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const car = cars.find((c) => c.id === selectedId) ?? cars[0];
  if (!car) return null;

  return (
    <div className="mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle carbon-texture mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-surface-2" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent-2/10 blur-3xl" />

        <div className="relative grid lg:grid-cols-2 gap-8 items-center p-6 sm:p-10 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={car.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 lg:order-1"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge tone="accent">{car.country}</Badge>
                {car.segment && <Badge>{car.segment}</Badge>}
              </div>
              <p className="font-display text-sm uppercase tracking-[0.3em] text-accent-2 mb-2">{car.company}</p>
              <h2 className="font-display text-3xl sm:text-4xl xl:text-5xl font-bold leading-[1.05] mb-2">{car.model}</h2>
              <p className="text-muted mb-6">
                {[car.generation, car.variant].filter(Boolean).join(" · ")} · {fmtYearRange(car.productionStart, car.productionEnd)}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/cars/${car.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-5 py-2.5 text-sm font-semibold hover:bg-accent/90 transition-all"
                >
                  Full Specs <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => toggleCompareTray(car.slug)}
                  className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold hover:bg-surface-2 transition-colors"
                >
                  <GitCompare className="w-4 h-4" /> Compare
                </button>
                <button
                  onClick={() => removeFromGarage(car.id)}
                  aria-label="Remove from garage"
                  className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold text-muted hover:text-accent hover:border-accent/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`visual-${car.id}`}
              initial={{ opacity: 0, x: 50, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.92 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 lg:order-2"
            >
              <CarSilhouette
                bodyStyle={car.bodyStyle}
                rolling={!prefersReducedMotion}
                className="w-full text-foreground drop-shadow-[0_20px_40px_rgba(255,51,85,0.15)]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {cars.length > 1 && (
          <div className="relative flex gap-2 overflow-x-auto px-6 sm:px-10 lg:px-12 pb-6 pt-1">
            {cars.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                aria-label={`Show ${c.company} ${c.model}`}
                aria-current={c.id === car.id}
                className={cn(
                  "w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                  c.id === car.id ? "border-accent opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                )}
              >
                <CarVisual car={c} showLabel={false} hoverSpin={false} className="w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      <PerformanceDashboard car={car} />
    </div>
  );
}
