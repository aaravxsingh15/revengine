import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-2">{eyebrow}</p>
        )}
        <h2 className="font-display text-2xl sm:text-3xl font-bold">{title}</h2>
        {description && <p className="text-muted mt-2 max-w-xl">{description}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-2.5 transition-all shrink-0"
        >
          {actionLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
