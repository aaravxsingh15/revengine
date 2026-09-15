import { cn } from "@/lib/format";

function Shimmer({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-surface-3", className)} />;
}

export function CarCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden">
      <Shimmer className="aspect-[16/10] rounded-none" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-4 w-2/3" />
        <Shimmer className="h-3 w-1/3" />
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Shimmer className="h-8" />
          <Shimmer className="h-8" />
          <Shimmer className="h-8" />
        </div>
      </div>
    </div>
  );
}

export function CarGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SpecTableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Shimmer key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function PerformanceCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Shimmer key={i} className="h-28" />
      ))}
    </div>
  );
}
