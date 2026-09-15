"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { getAllCars, searchCars } from "@/lib/cars";
import CarVisual from "@/components/ui/CarVisual";

export default function ComparePicker({
  excludeSlugs,
  onAdd,
  disabled,
}: {
  excludeSlugs: string[];
  onAdd: (slug: string) => void;
  disabled: boolean;
}) {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? searchCars(getAllCars(), query).filter((c) => !excludeSlugs.includes(c.slug)).slice(0, 6)
    : [];

  return (
    <div className="rounded-2xl border-2 border-dashed border-border-strong bg-surface/50 p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
      {disabled ? (
        <p className="text-sm text-muted">Maximum of 4 cars reached</p>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-accent" />
          </div>
          <p className="text-sm font-medium mb-3">Add a car to compare</p>
          <div className="relative w-full max-w-xs">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cars..."
              className="w-full rounded-full bg-surface-2 border border-border-subtle px-4 py-2 text-sm outline-none focus:border-accent/50"
            />
            {results.length > 0 && (
              <ul className="absolute z-20 mt-2 w-full rounded-xl border border-border-subtle bg-surface-2 shadow-xl overflow-hidden text-left">
                {results.map((car) => (
                  <li key={car.id}>
                    <button
                      onClick={() => {
                        onAdd(car.slug);
                        setQuery("");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-3 transition-colors"
                    >
                      <div className="w-10 h-8 rounded-md overflow-hidden shrink-0">
                        <CarVisual car={car} showLabel={false} className="w-full h-full" />
                      </div>
                      <span className="text-sm truncate">
                        {car.company} {car.model}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
