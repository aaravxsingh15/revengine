import { PerformanceCardsSkeleton, SpecTableSkeleton } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="aspect-[21/9] rounded-3xl bg-surface-3 animate-pulse" />
      <PerformanceCardsSkeleton />
      <SpecTableSkeleton />
    </div>
  );
}
