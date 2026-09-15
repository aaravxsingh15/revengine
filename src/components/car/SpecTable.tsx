export interface SpecRow {
  label: string;
  value: string | number | null;
  unit?: string;
}

export default function SpecTable({ title, rows }: { title?: string; rows: SpecRow[] }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden">
      {title && (
        <div className="px-5 py-3.5 border-b border-border-subtle">
          <h3 className="font-display font-semibold text-sm uppercase tracking-wide">{title}</h3>
        </div>
      )}
      <dl>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-3 text-sm ${i % 2 === 1 ? "bg-surface-2/40" : ""}`}
          >
            <dt className="text-muted">{row.label}</dt>
            <dd className="font-medium font-display stat-number text-right">
              {row.value === null || row.value === undefined || row.value === "" ? (
                <span className="text-muted-2">N/A</span>
              ) : (
                <>
                  {row.value}
                  {row.unit ? ` ${row.unit}` : ""}
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
