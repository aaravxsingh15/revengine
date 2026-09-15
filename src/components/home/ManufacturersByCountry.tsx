import { getAllManufacturers } from "@/lib/cars";
import ManufacturerCard from "@/components/manufacturer/ManufacturerCard";

export default function ManufacturersByCountry() {
  const manufacturers = getAllManufacturers();
  const byCountry = new Map<string, typeof manufacturers>();

  for (const m of manufacturers) {
    const list = byCountry.get(m.country) ?? [];
    list.push(m);
    byCountry.set(m.country, list);
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from(byCountry.entries()).map(([country, list]) => (
        <div key={country}>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted mb-3">{country}</h3>
          <div className="space-y-2">
            {list.map((m) => (
              <ManufacturerCard key={m.slug} manufacturer={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
