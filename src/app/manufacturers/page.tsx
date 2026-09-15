import type { Metadata } from "next";
import ManufacturersByCountry from "@/components/home/ManufacturersByCountry";

export const metadata: Metadata = {
  title: "Manufacturers",
  description: "Browse every manufacturer in the RevEngine catalog, from Japanese tuner icons to European hypercar ateliers.",
};

export default function ManufacturersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Manufacturers</h1>
      <p className="text-muted mb-10 max-w-2xl">
        Every brand represented in the RevEngine vault, grouped by country of origin.
      </p>
      <ManufacturersByCountry />
    </div>
  );
}
