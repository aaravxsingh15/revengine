"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { getAllCars, filterCars, searchCars, sortCars, type CarFilters, type SortKey } from "@/lib/cars";
import CarGrid from "@/components/car/CarGrid";
import FilterPanel from "@/components/car/FilterPanel";
import { cn } from "@/lib/format";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "horsepower", label: "Horsepower" },
  { key: "torque", label: "Torque" },
  { key: "zeroTo100", label: "0–100 km/h" },
  { key: "topSpeed", label: "Top Speed" },
  { key: "weight", label: "Weight" },
  { key: "year", label: "Production Year" },
  { key: "manufacturer", label: "Manufacturer" },
];

const PAGE_SIZE = 12;

export default function CarsBrowseClient({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<CarFilters>({});
  const [sortKey, setSortKey] = useState<SortKey>("horsepower");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allCars = useMemo(() => getAllCars(), []);

  const results = useMemo(() => {
    const base = query.trim() ? searchCars(allCars, query) : allCars;
    const filtered = filterCars(base, filters);
    return sortCars(filtered, sortKey, direction);
  }, [allCars, query, filters, sortKey, direction]);

  const visible = results.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Browse Cars</h1>
        <p className="text-muted">{results.length} of {allCars.length} cars match your search</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 rounded-full bg-surface-2 border border-border-subtle px-4 py-2.5">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search by manufacturer, model, or generation..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-2"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X className="w-4 h-4 text-muted" />
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileFiltersOpen((o) => !o)}
          className="lg:hidden flex items-center justify-center gap-2 rounded-full border border-border-subtle px-4 py-2.5 text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>

        <select
          value={`${sortKey}:${direction}`}
          onChange={(e) => {
            const [key, dir] = e.target.value.split(":");
            setSortKey(key as SortKey);
            setDirection(dir as "asc" | "desc");
          }}
          className="rounded-full bg-surface-2 border border-border-subtle px-4 py-2.5 text-sm outline-none focus:border-accent/50"
        >
          {SORT_OPTIONS.map((opt) => (
            <optgroup key={opt.key} label={opt.label}>
              <option value={`${opt.key}:desc`}>{opt.label} (High to Low)</option>
              <option value={`${opt.key}:asc`}>{opt.label} (Low to High)</option>
            </optgroup>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className={cn("lg:block", mobileFiltersOpen ? "block" : "hidden")}>
          <div className="lg:sticky lg:top-24">
            <FilterPanel
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setVisibleCount(PAGE_SIZE);
              }}
            />
          </div>
        </aside>

        <div>
          <CarGrid cars={visible} query={query} />
          {visibleCount < results.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-full border border-border-strong px-6 py-3 text-sm font-semibold hover:bg-surface-2 transition-colors"
              >
                Load More ({results.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
