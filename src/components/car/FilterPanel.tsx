"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { CarFilters } from "@/lib/cars";
import { getAllCars, getAllManufacturers } from "@/lib/cars";
import { cn } from "@/lib/format";

function uniqueSorted<T>(values: (T | null)[]): T[] {
  return Array.from(new Set(values.filter((v): v is T => v !== null))).sort();
}

function FilterSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border-subtle py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-sm font-semibold"
        aria-expanded={open}
      >
        {title}
        <ChevronDown className={cn("w-4 h-4 text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-muted hover:text-foreground cursor-pointer transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border-strong bg-surface-2 accent-accent"
      />
      {label}
    </label>
  );
}

function NumberField({ label, value, onChange, placeholder }: { label: string; value: number | undefined; onChange: (v: number | undefined) => void; placeholder: string }) {
  return (
    <div className="flex-1">
      <label className="text-xs text-muted-2 block mb-1">{label}</label>
      <input
        type="number"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className="w-full rounded-lg bg-surface-2 border border-border-subtle px-2.5 py-1.5 text-sm outline-none focus:border-accent/50"
      />
    </div>
  );
}

function toggleInArray<T>(arr: T[] | undefined, value: T): T[] {
  const current = arr ?? [];
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
}

export default function FilterPanel({
  filters,
  onChange,
}: {
  filters: CarFilters;
  onChange: (filters: CarFilters) => void;
}) {
  const cars = useMemo(() => getAllCars(), []);
  const manufacturers = getAllManufacturers();
  const countries = uniqueSorted(cars.map((c) => c.country));
  const bodyStyles = uniqueSorted(cars.map((c) => c.bodyStyle));
  const segments = uniqueSorted(cars.map((c) => c.segment));
  const aspirations = uniqueSorted(cars.map((c) => c.engine.aspiration));
  const fuelTypes = uniqueSorted(cars.map((c) => c.engine.fuelType));
  const drivetrains = uniqueSorted(cars.map((c) => c.transmission.drivetrain));
  const cylinderCounts = uniqueSorted(cars.map((c) => c.engine.cylinders));

  const activeCount =
    (filters.manufacturers?.length ?? 0) +
    (filters.countries?.length ?? 0) +
    (filters.bodyStyles?.length ?? 0) +
    (filters.segments?.length ?? 0) +
    (filters.aspirations?.length ?? 0) +
    (filters.fuelTypes?.length ?? 0) +
    (filters.drivetrains?.length ?? 0) +
    (filters.cylinders?.length ?? 0) +
    (filters.productionStatus?.length ?? 0) +
    (filters.yearMin !== undefined ? 1 : 0) +
    (filters.yearMax !== undefined ? 1 : 0) +
    (filters.hpMin !== undefined ? 1 : 0) +
    (filters.hpMax !== undefined ? 1 : 0) +
    (filters.torqueMin !== undefined ? 1 : 0) +
    (filters.torqueMax !== undefined ? 1 : 0) +
    (filters.zeroTo100Max !== undefined ? 1 : 0) +
    (filters.topSpeedMin !== undefined ? 1 : 0) +
    (filters.weightMax !== undefined ? 1 : 0) +
    (filters.priceMax !== undefined ? 1 : 0);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-semibold">Filters</h2>
        {activeCount > 0 && (
          <button onClick={() => onChange({})} className="flex items-center gap-1 text-xs text-accent hover:underline">
            <X className="w-3 h-3" /> Clear ({activeCount})
          </button>
        )}
      </div>

      <FilterSection title="Manufacturer" defaultOpen>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
          {manufacturers.map((m) => (
            <CheckboxRow
              key={m.slug}
              label={m.name}
              checked={filters.manufacturers?.includes(m.slug) ?? false}
              onChange={() => onChange({ ...filters, manufacturers: toggleInArray(filters.manufacturers, m.slug) })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Country">
        {countries.map((c) => (
          <CheckboxRow
            key={c}
            label={c}
            checked={filters.countries?.includes(c) ?? false}
            onChange={() => onChange({ ...filters, countries: toggleInArray(filters.countries, c) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Body Style">
        {bodyStyles.map((b) => (
          <CheckboxRow
            key={b}
            label={b}
            checked={filters.bodyStyles?.includes(b) ?? false}
            onChange={() => onChange({ ...filters, bodyStyles: toggleInArray(filters.bodyStyles, b) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Segment">
        {segments.map((s) => (
          <CheckboxRow
            key={s}
            label={s}
            checked={filters.segments?.includes(s) ?? false}
            onChange={() => onChange({ ...filters, segments: toggleInArray(filters.segments, s) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Production Status">
        {["in_production", "discontinued", "limited_run"].map((s) => (
          <CheckboxRow
            key={s}
            label={s === "in_production" ? "In Production" : s === "discontinued" ? "Discontinued" : "Limited Run"}
            checked={filters.productionStatus?.includes(s) ?? false}
            onChange={() => onChange({ ...filters, productionStatus: toggleInArray(filters.productionStatus, s) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Engine">
        <p className="text-xs text-muted-2 mb-1">Aspiration</p>
        {aspirations.map((a) => (
          <CheckboxRow
            key={a}
            label={a}
            checked={filters.aspirations?.includes(a) ?? false}
            onChange={() => onChange({ ...filters, aspirations: toggleInArray(filters.aspirations, a) })}
          />
        ))}
        <p className="text-xs text-muted-2 mb-1 mt-3">Fuel Type</p>
        {fuelTypes.map((f) => (
          <CheckboxRow
            key={f}
            label={f}
            checked={filters.fuelTypes?.includes(f) ?? false}
            onChange={() => onChange({ ...filters, fuelTypes: toggleInArray(filters.fuelTypes, f) })}
          />
        ))}
        <p className="text-xs text-muted-2 mb-1 mt-3">Cylinders</p>
        <div className="flex flex-wrap gap-2">
          {cylinderCounts.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...filters, cylinders: toggleInArray(filters.cylinders, c) })}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs border transition-colors",
                filters.cylinders?.includes(c)
                  ? "bg-accent border-accent text-white"
                  : "border-border-subtle text-muted hover:border-border-strong"
              )}
            >
              {c}-cyl
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Drivetrain">
        {drivetrains.map((d) => (
          <CheckboxRow
            key={d}
            label={d}
            checked={filters.drivetrains?.includes(d) ?? false}
            onChange={() => onChange({ ...filters, drivetrains: toggleInArray(filters.drivetrains, d) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Performance Ranges">
        <div className="flex gap-2">
          <NumberField label="Min Year" value={filters.yearMin} onChange={(v) => onChange({ ...filters, yearMin: v })} placeholder="1980" />
          <NumberField label="Max Year" value={filters.yearMax} onChange={(v) => onChange({ ...filters, yearMax: v })} placeholder="2026" />
        </div>
        <div className="flex gap-2">
          <NumberField label="Min HP" value={filters.hpMin} onChange={(v) => onChange({ ...filters, hpMin: v })} placeholder="0" />
          <NumberField label="Max HP" value={filters.hpMax} onChange={(v) => onChange({ ...filters, hpMax: v })} placeholder="1300" />
        </div>
        <div className="flex gap-2">
          <NumberField label="Min Torque" value={filters.torqueMin} onChange={(v) => onChange({ ...filters, torqueMin: v })} placeholder="0" />
          <NumberField label="Max Torque" value={filters.torqueMax} onChange={(v) => onChange({ ...filters, torqueMax: v })} placeholder="1500" />
        </div>
        <NumberField label="Max 0–100 (s)" value={filters.zeroTo100Max} onChange={(v) => onChange({ ...filters, zeroTo100Max: v })} placeholder="10" />
        <NumberField label="Min Top Speed (km/h)" value={filters.topSpeedMin} onChange={(v) => onChange({ ...filters, topSpeedMin: v })} placeholder="0" />
        <NumberField label="Max Weight (kg)" value={filters.weightMax} onChange={(v) => onChange({ ...filters, weightMax: v })} placeholder="2500" />
        <NumberField label="Max Price (USD)" value={filters.priceMax} onChange={(v) => onChange({ ...filters, priceMax: v })} placeholder="500000" />
      </FilterSection>
    </div>
  );
}
