import { CarGridSkeleton } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-9 w-48 rounded-lg bg-surface-3 animate-pulse mb-8" />
      <CarGridSkeleton />
    </div>
  );
}
