"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { getAllCars, searchCars } from "@/lib/cars";
import { fmt, fmtDecimal } from "@/lib/format";
import CarVisual from "@/components/ui/CarVisual";

export default function SearchBar({
  variant = "navbar",
  autoFocus = false,
  onNavigate,
}: {
  variant?: "navbar" | "hero";
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim() ? searchCars(getAllCars(), query).slice(0, 6) : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function goToResults() {
    if (!query.trim()) return;
    router.push(`/cars?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={
          variant === "hero"
            ? "flex items-center gap-3 rounded-full glass-panel px-5 py-4 focus-within:border-accent/50 transition-colors"
            : "flex items-center gap-2 rounded-full bg-surface-2 border border-border-subtle px-4 py-2 focus-within:border-accent/50 transition-colors"
        }
      >
        <Search className={variant === "hero" ? "w-5 h-5 text-muted shrink-0" : "w-4 h-4 text-muted shrink-0"} />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && goToResults()}
          placeholder="Search any car... e.g. GT-R, Supra, Ferrari"
          aria-label="Search cars"
          className={
            variant === "hero"
              ? "flex-1 bg-transparent outline-none text-base placeholder:text-muted-2"
              : "flex-1 bg-transparent outline-none text-sm placeholder:text-muted-2 w-40 md:w-56"
          }
        />
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute z-50 mt-2 w-full min-w-[320px] rounded-2xl border border-border-subtle bg-surface-2 shadow-2xl shadow-black/50 overflow-hidden">
          {results.length === 0 ? (
            <div className="p-5 text-sm text-muted text-center">No cars found for &ldquo;{query}&rdquo;</div>
          ) : (
            <ul>
              {results.map((car) => (
                <li key={car.id} className="border-b border-border-subtle last:border-b-0">
                  <Link
                    href={`/cars/${car.slug}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors"
                  >
                    <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0">
                      <CarVisual car={car} showLabel={false} className="w-full h-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {car.company} {car.model} {car.generation ?? car.variant ?? ""}
                      </p>
                      <p className="text-xs text-muted">
                        {fmt(car.performance.horsepowerHp, "hp")} · {fmtDecimal(car.performance.zeroTo100Sec, "s")} 0-100 · {fmt(car.performance.topSpeedKmh, "km/h")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={goToResults}
            className="w-full text-left px-4 py-3 text-sm font-medium text-accent hover:bg-surface-3 transition-colors border-t border-border-subtle"
          >
            View all results for &ldquo;{query}&rdquo; →
          </button>
        </div>
      )}
    </div>
  );
}
