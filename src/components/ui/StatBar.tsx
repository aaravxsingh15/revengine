"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/format";

export default function StatBar({
  label,
  value,
  max,
  displayValue,
  accent = "accent",
  highlight = false,
}: {
  label: string;
  value: number | null;
  max: number;
  displayValue: string;
  accent?: "accent" | "accent-2";
  highlight?: boolean;
}) {
  const pct = value === null || max === 0 ? 0 : Math.min(100, Math.max(2, (value / max) * 100));
  const barColor = accent === "accent" ? "bg-accent" : "bg-accent-2";

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <span className={cn("text-sm truncate", highlight ? "text-foreground font-medium" : "text-muted")}>{label}</span>
        <span className={cn("text-sm font-display font-semibold stat-number shrink-0", highlight && "text-accent")}>
          {displayValue}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
