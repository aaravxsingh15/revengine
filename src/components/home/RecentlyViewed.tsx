"use client";

import { useRecentlyViewedIds } from "@/hooks/useGarage";
import { getAllCars } from "@/lib/cars";
import CarGrid from "@/components/car/CarGrid";

export default function RecentlyViewed() {
  const ids = useRecentlyViewedIds();
  if (ids.length === 0) return null;

  const cars = ids
    .map((id) => getAllCars().find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 4);

  if (cars.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Recently Viewed</h2>
      <CarGrid cars={cars} />
    </section>
  );
}
