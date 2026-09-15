export function fmt(value: number | null | undefined, unit = ""): string {
  if (value === null || value === undefined) return "N/A";
  return `${value.toLocaleString("en-US")}${unit ? ` ${unit}` : ""}`;
}

export function fmtDecimal(value: number | null | undefined, unit = "", digits = 1): string {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(digits)}${unit ? ` ${unit}` : ""}`;
}

export function fmtCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString("en-US")}`;
}

export function fmtYearRange(start: number | null, end: number | null): string {
  if (start === null) return "N/A";
  if (end === null) return `${start} – Present`;
  if (start === end) return `${start}`;
  return `${start} – ${end}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
