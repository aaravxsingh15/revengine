"use client";

import { AnimatePresence } from "framer-motion";
import type { Car } from "@/types/car";
import CarCard from "./CarCard";
import { EmptySearchState } from "@/components/ui/ErrorState";

export default function CarGrid({ cars, query }: { cars: Car[]; query?: string }) {
  if (cars.length === 0) {
    return <EmptySearchState query={query} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <AnimatePresence mode="popLayout">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </AnimatePresence>
    </div>
  );
}
