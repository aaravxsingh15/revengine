import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllManufacturers, getManufacturer, getCarsByManufacturer, sortCars } from "@/lib/cars";
import CarGrid from "@/components/car/CarGrid";
import Badge from "@/components/ui/Badge";
import { fmt, fmtDecimal } from "@/lib/format";

export function generateStaticParams() {
  return getAllManufacturers().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: PageProps<"/manufacturers/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const manufacturer = getManufacturer(slug);
  if (!manufacturer) return { title: "Manufacturer Not Found" };

  return {
    title: manufacturer.name,
    description: manufacturer.description,
  };
}

export default async function ManufacturerPage(props: PageProps<"/manufacturers/[slug]">) {
  const { slug } = await props.params;
  const manufacturer = getManufacturer(slug);
  if (!manufacturer) notFound();

  const cars = sortCars(getCarsByManufacturer(slug), "horsepower", "desc");
  const fastestCar = sortCars(cars, "zeroTo100", "asc")[0];
  const mostPowerfulCar = cars[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border-subtle flex items-center justify-center font-display font-bold text-2xl text-accent shrink-0">
          {manufacturer.logoInitial}
        </div>
        <div>
          <Badge tone="accent" className="mb-2">{manufacturer.country}</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">{manufacturer.name}</h1>
        </div>
      </div>

      <p className="text-muted max-w-3xl mb-4">{manufacturer.description}</p>
      {manufacturer.history && <p className="text-muted max-w-3xl mb-10">{manufacturer.history}</p>}

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="Models in Database" value={String(cars.length)} />
        <StatCard
          label="Most Powerful"
          value={mostPowerfulCar ? `${mostPowerfulCar.model} — ${fmt(mostPowerfulCar.performance.horsepowerHp, "HP")}` : "N/A"}
        />
        <StatCard
          label="Fastest 0–100"
          value={fastestCar ? `${fastestCar.model} — ${fmtDecimal(fastestCar.performance.zeroTo100Sec, "s")}` : "N/A"}
        />
      </div>

      <h2 className="font-display text-2xl font-bold mb-6">{manufacturer.name} Models</h2>
      <CarGrid cars={cars} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5">
      <p className="font-display font-semibold truncate">{value}</p>
      <p className="text-xs text-muted uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}
