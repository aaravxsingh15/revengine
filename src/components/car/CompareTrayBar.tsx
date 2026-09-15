"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, GitCompare } from "lucide-react";
import { useCompareTrayIds, removeFromCompareTray, clearCompareTray, MAX_COMPARE } from "@/hooks/useCompareTray";
import { getAllCars } from "@/lib/cars";

export default function CompareTrayBar() {
  const slugs = useCompareTrayIds();
  const cars = getAllCars().filter((c) => slugs.includes(c.slug));

  return (
    <AnimatePresence>
      {cars.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
        >
          <div className="glass-panel rounded-2xl shadow-2xl shadow-black/60 px-4 py-3 flex items-center gap-3 flex-wrap">
            <GitCompare className="w-5 h-5 text-accent-2 shrink-0" />
            <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
              {cars.map((car) => (
                <span
                  key={car.id}
                  className="inline-flex items-center gap-1.5 bg-surface-3 rounded-full pl-3 pr-1.5 py-1 text-xs font-medium"
                >
                  {car.company} {car.model}
                  <button
                    onClick={() => removeFromCompareTray(car.slug)}
                    aria-label={`Remove ${car.model} from comparison`}
                    className="w-4 h-4 rounded-full bg-surface hover:bg-accent/20 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {cars.length < 2 && <span className="text-xs text-muted">Add at least 1 more car</span>}
              {cars.length >= MAX_COMPARE && <span className="text-xs text-muted-2">Max {MAX_COMPARE} reached</span>}
            </div>
            <button onClick={clearCompareTray} className="text-xs text-muted hover:text-foreground shrink-0">
              Clear
            </button>
            <Link
              href={`/compare?cars=${cars.map((c) => c.slug).join(",")}`}
              className="shrink-0 rounded-full bg-accent text-white text-sm font-semibold px-4 py-2 hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-disabled={cars.length < 2}
              tabIndex={cars.length < 2 ? -1 : 0}
              style={cars.length < 2 ? { pointerEvents: "none", opacity: 0.4 } : undefined}
            >
              Compare
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
