"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Car } from "@/types/car";
import { getRadarAxes } from "@/lib/comparison";

const COLORS = ["#ff3355", "#00e0ff", "#ffb238", "#2fe38a"];

export default function RadarComparisonChart({ cars }: { cars: Car[] }) {
  const axisKeys = getRadarAxes(cars[0], cars).map((a) => ({ key: a.key, label: a.label }));

  const data = axisKeys.map(({ key, label }) => {
    const row: Record<string, string | number> = { axis: label };
    cars.forEach((car) => {
      const axes = getRadarAxes(car, cars);
      const match = axes.find((a) => a.key === key);
      row[car.slug] = match?.score ?? 0;
    });
    return row;
  });

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6">
      <h3 className="font-display font-semibold mb-1">Performance Radar</h3>
      <p className="text-xs text-muted-2 mb-4">
        Each axis is normalized 0–100 against the strongest car in this comparison. Handling is a proxy combining
        power-to-weight and acceleration — no lateral grip data exists in the dataset.
      </p>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="var(--border-subtle)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--muted-2)", fontSize: 10 }} />
          {cars.map((car, i) => (
            <Radar
              key={car.slug}
              name={`${car.company} ${car.model}`}
              dataKey={car.slug}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
          <Tooltip
            contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border-subtle)", borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: "var(--foreground)" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
