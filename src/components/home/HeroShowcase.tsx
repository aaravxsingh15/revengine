"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, GitCompare } from "lucide-react";
import type { Car } from "@/types/car";
import CarSilhouette from "@/components/ui/CarSilhouette";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { fmtYearRange } from "@/lib/format";
import { toggleCompareTray } from "@/hooks/useCompareTray";

const AUTO_ADVANCE_MS = 6500;

export default function HeroShowcase({ cars }: { cars: Car[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const car = cars[index];

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % cars.length);
  }, [cars.length]);

  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const timer = setInterval(advance, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [advance, paused, prefersReducedMotion]);

  const p = car.performance;

  return (
    <div
      className="relative rounded-3xl border border-border-subtle overflow-hidden carbon-texture"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-surface-2" />
      <motion.div
        key={`glow-${car.id}`}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent-2/10 blur-3xl" />

      <div className="relative grid lg:grid-cols-2 gap-8 items-center p-6 sm:p-10 lg:p-14 min-h-[560px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={car.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <p className="font-display text-sm uppercase tracking-[0.3em] text-accent-2 mb-3">
              Featured · {car.country}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] mb-2">
              {car.company}
              <br />
              <span className="text-gradient-accent">{car.model}</span>
            </h1>
            <p className="text-muted mb-8">
              {[car.generation, car.variant].filter(Boolean).join(" · ") || car.segment} ·{" "}
              {fmtYearRange(car.productionStart, car.productionEnd)}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatBlock label="Horsepower" value={p.horsepowerHp} suffix=" HP" />
              <StatBlock label="Torque" value={p.torqueNm} suffix=" Nm" />
              <StatBlock label="0–100 km/h" value={p.zeroTo100Sec} suffix=" s" decimals={1} />
              <StatBlock label="Top Speed" value={p.topSpeedKmh} suffix=" km/h" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/cars/${car.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-5 py-3 text-sm font-semibold hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 transition-all"
              >
                Explore Car <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => toggleCompareTray(car.slug)}
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-3 text-sm font-semibold hover:bg-surface-2 transition-colors"
              >
                <GitCompare className="w-4 h-4" /> Compare
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`visual-${car.id}`}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.92 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <CarSilhouette className="w-full text-foreground drop-shadow-[0_20px_40px_rgba(255,51,85,0.15)]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex items-center justify-center gap-2 pb-6">
        {cars.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setIndex(i)}
            aria-label={`Show ${c.company} ${c.model}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-accent" : "w-1.5 bg-border-strong hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  suffix,
  decimals = 0,
}: {
  label: string;
  value: number | null;
  suffix: string;
  decimals?: number;
}) {
  return (
    <div>
      <p className="font-display text-2xl sm:text-3xl font-bold stat-number">
        <AnimatedNumber value={value} decimals={decimals} suffix={value !== null ? suffix : ""} />
      </p>
      <p className="text-xs text-muted uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  );
}
