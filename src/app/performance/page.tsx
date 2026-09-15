import type { Metadata } from "next";
import { Zap, Gauge, Wind, ArrowUpRight, Feather, Scale } from "lucide-react";
import LeaderboardSection from "@/components/performance/LeaderboardSection";
import { fmt, fmtDecimal } from "@/lib/format";

export const metadata: Metadata = {
  title: "Performance Leaderboards",
  description: "Dynamically calculated leaderboards for horsepower, torque, acceleration, top speed and more across the RevEngine catalog.",
};

const SECTIONS = [
  { id: "acceleration", title: "Fastest 0–100 km/h", description: "The quickest-accelerating cars in the database.", icon: Zap, metricKey: "zeroTo100" as const, format: (v: number | null) => fmtDecimal(v, "s") },
  { id: "horsepower", title: "Highest Horsepower", description: "Ranked by peak power output.", icon: Gauge, metricKey: "horsepower" as const, format: (v: number | null) => fmt(v, "HP") },
  { id: "torque", title: "Highest Torque", description: "Ranked by peak torque output.", icon: Wind, metricKey: "torque" as const, format: (v: number | null) => fmt(v, "Nm") },
  { id: "top-speed", title: "Highest Top Speed", description: "The fastest cars in a straight line.", icon: ArrowUpRight, metricKey: "topSpeed" as const, format: (v: number | null) => fmt(v, "km/h") },
  { id: "power-to-weight", title: "Best Power-to-Weight", description: "Horsepower per metric tonne — the clearest single measure of straight-line potential.", icon: Scale, metricKey: "powerToWeight" as const, format: (v: number | null) => fmt(v, "hp/t") },
  { id: "lightest", title: "Lightest Cars", description: "Ranked by kerb weight, lightest first.", icon: Feather, metricKey: "weight" as const, format: (v: number | null) => fmt(v, "kg") },
];

export default function PerformancePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Performance Leaderboards</h1>
      <p className="text-muted mb-6 max-w-2xl">
        Every leaderboard here is calculated live from the current RevEngine dataset — nothing is hand-curated.
      </p>

      <nav className="flex flex-wrap gap-2 mb-12">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-xs font-medium rounded-full border border-border-subtle px-3 py-1.5 text-muted hover:text-foreground hover:border-border-strong transition-colors"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <div className="space-y-16">
        {SECTIONS.map((s) => (
          <LeaderboardSection key={s.id} {...s} limit={15} />
        ))}
      </div>
    </div>
  );
}
