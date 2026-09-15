import Link from "next/link";
import type { Manufacturer } from "@/types/car";
import { getCarsByManufacturer } from "@/lib/cars";

export default function ManufacturerCard({ manufacturer }: { manufacturer: Manufacturer }) {
  const count = getCarsByManufacturer(manufacturer.slug).length;

  return (
    <Link
      href={`/manufacturers/${manufacturer.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-4 hover:border-accent/40 hover:bg-surface-2 transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-surface-3 border border-border-subtle flex items-center justify-center font-display font-bold text-lg text-accent shrink-0 group-hover:border-accent/40 transition-colors">
        {manufacturer.logoInitial}
      </div>
      <div className="min-w-0">
        <p className="font-display font-semibold truncate">{manufacturer.name}</p>
        <p className="text-xs text-muted">
          {count} {count === 1 ? "car" : "cars"}
        </p>
      </div>
    </Link>
  );
}
