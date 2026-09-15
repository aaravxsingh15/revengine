import Link from "next/link";
import { AlertTriangle, SearchX } from "lucide-react";

export default function ErrorState({
  icon: Icon = AlertTriangle,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: typeof AlertTriangle;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="w-14 h-14 rounded-full bg-surface-2 border border-border-subtle flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-muted" />
      </div>
      <h2 className="font-display text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted max-w-md mb-6">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-5 py-2.5 text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function EmptySearchState({ query }: { query?: string }) {
  return (
    <ErrorState
      icon={SearchX}
      title={query ? `No results for "${query}"` : "No cars match these filters"}
      description="Try a different search term, or clear your filters to see the full RevEngine catalog."
      actionHref="/cars"
      actionLabel="Browse all cars"
    />
  );
}
