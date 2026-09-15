"use client";

import { useState } from "react";
import Link from "next/link";
import { Car as CarIcon } from "lucide-react";
import { useGarageIds, clearGarage } from "@/hooks/useGarage";
import { getAllCars, sortCars, type SortKey } from "@/lib/cars";
import GarageCard from "@/components/car/GarageCard";
import GarageShowcase from "@/components/car/GarageShowcase";
import ErrorState from "@/components/ui/ErrorState";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "horsepower", label: "Horsepower" },
  { key: "zeroTo100", label: "0–100 km/h" },
  { key: "topSpeed", label: "Top Speed" },
  { key: "year", label: "Production Year" },
  { key: "manufacturer", label: "Manufacturer" },
];

export default function GarageClient() {
  const garageIds = useGarageIds();
  const [sortKey, setSortKey] = useState<SortKey>("horsepower");
  const [selected, setSelected] = useState<string[]>([]);

  const cars = sortCars(
    getAllCars().filter((c) => garageIds.includes(c.id)),
    sortKey,
    sortKey === "zeroTo100" ? "asc" : "desc"
  );

  function toggleSelect(slug: string) {
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : s.length < 4 ? [...s, slug] : s));
  }

  if (cars.length === 0) {
    return (
      <ErrorState
        icon={CarIcon}
        title="Your garage is empty"
        description="Save cars from the catalog to build your personal garage — click the heart icon on any car to add it here."
        actionHref="/cars"
        actionLabel="Browse cars"
      />
    );
  }

  return (
    <div>
      <GarageShowcase cars={cars} />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <p className="text-muted">
          {cars.length} {cars.length === 1 ? "car" : "cars"} saved
          {selected.length > 0 && ` · ${selected.length} selected for comparison`}
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-full bg-surface-2 border border-border-subtle px-4 py-2 text-sm outline-none focus:border-accent/50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                Sort by {opt.label}
              </option>
            ))}
          </select>
          {selected.length >= 2 && (
            <Link
              href={`/compare?cars=${selected.join(",")}`}
              className="rounded-full bg-accent text-white px-4 py-2 text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              Compare Selected
            </Link>
          )}
          <button onClick={clearGarage} className="text-sm text-muted hover:text-foreground transition-colors">
            Clear Garage
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cars.map((car) => (
          <GarageCard
            key={car.id}
            car={car}
            selected={selected.includes(car.slug)}
            onToggleSelect={() => toggleSelect(car.slug)}
          />
        ))}
      </div>
    </div>
  );
}
