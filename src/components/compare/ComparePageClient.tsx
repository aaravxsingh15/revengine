"use client";

import { useRouter } from "next/navigation";
import { X, GitCompare } from "lucide-react";
import { getAllCars, getCarBySlug } from "@/lib/cars";
import CarVisual from "@/components/ui/CarVisual";
import ComparePicker from "./ComparePicker";
import ComparisonTable from "./ComparisonTable";
import PerformanceBars from "./PerformanceBars";
import RadarComparisonChart from "./RadarComparisonChart";
import HeadToHead from "./HeadToHead";
import ErrorState from "@/components/ui/ErrorState";

const MAX_COMPARE = 4;

// slugs come from the server (page.tsx reads `searchParams` and passes them
// down) rather than this component calling useSearchParams() itself — that
// avoids the client-side Suspense-for-search-params path entirely, since the
// URL is still the single source of truth (shareable links), just read on
// the server instead of re-read on the client.
export default function ComparePageClient({ initialSlugs }: { initialSlugs: string[] }) {
  const router = useRouter();
  const slugs = initialSlugs;

  const cars = slugs
    .map((slug) => getCarBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  function navigateTo(nextSlugs: string[]) {
    router.replace(nextSlugs.length ? `/compare?cars=${nextSlugs.join(",")}` : "/compare", { scroll: false });
  }

  function addCar(slug: string) {
    if (slugs.includes(slug) || slugs.length >= MAX_COMPARE) return;
    navigateTo([...slugs, slug]);
  }

  function removeCar(slug: string) {
    navigateTo(slugs.filter((s) => s !== slug));
  }

  const allCars = getAllCars();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <GitCompare className="w-8 h-8 text-accent mx-auto mb-3" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Compare Cars</h1>
        <p className="text-muted max-w-xl mx-auto">
          Pick 2 to 4 cars for a full side-by-side breakdown — engine, performance, dimensions and pricing, with the
          strongest number in each category called out automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cars.map((car) => (
          <div key={car.id} className="relative rounded-2xl border border-border-subtle bg-surface overflow-hidden group">
            <button
              onClick={() => removeCar(car.slug)}
              aria-label={`Remove ${car.model} from comparison`}
              className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="aspect-[16/10]">
              <CarVisual car={car} showLabel={false} className="w-full h-full" />
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-2 uppercase truncate">{car.company}</p>
              <p className="font-display font-semibold text-sm truncate">{car.model}</p>
            </div>
          </div>
        ))}
        {cars.length < MAX_COMPARE && (
          <ComparePicker excludeSlugs={slugs} onAdd={addCar} disabled={false} />
        )}
      </div>

      {cars.length === 0 && (
        <ErrorState
          title="No cars selected"
          description="Search for a car above, or browse the catalog to start building a comparison."
          actionHref="/cars"
          actionLabel="Browse cars"
        />
      )}

      {cars.length === 1 && (
        <div className="text-center py-16">
          <p className="text-muted">Add at least one more car to see a comparison.</p>
        </div>
      )}

      {cars.length >= 2 && (
        <div className="space-y-10">
          {cars.length === 2 && <HeadToHead carA={cars[0]} carB={cars[1]} />}
          <ComparisonTable cars={cars} />
          <PerformanceBars cars={cars} />
          <RadarComparisonChart cars={cars} />
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {allCars.length} cars available to compare, {cars.length} selected.
      </p>
    </div>
  );
}
