import { cn } from "@/lib/format";
import CarSilhouette from "./CarSilhouette";
import type { Car } from "@/types/car";

const GRADIENTS = [
  "from-accent/25 via-surface-2 to-surface",
  "from-accent-2/20 via-surface-2 to-surface",
  "from-accent/20 via-accent-2/10 to-surface",
];

function gradientFor(car: Car): string {
  const idx = parseInt(car.id, 10) % GRADIENTS.length;
  return GRADIENTS[idx];
}

export default function CarVisual({
  car,
  className,
  showLabel = true,
}: {
  car: Car;
  className?: string;
  showLabel?: boolean;
}) {
  if (car.media.imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={car.media.imageUrl} alt={`${car.company} ${car.model}`} className={cn("w-full h-full object-cover", className)} />;
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br carbon-texture",
        gradientFor(car),
        className
      )}
    >
      <CarSilhouette className="w-[85%] text-foreground/70" />
      {showLabel && (
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between pointer-events-none">
          <span className="font-display text-xs tracking-[0.2em] uppercase text-muted">{car.company}</span>
          <span className="font-display text-xs tracking-[0.2em] uppercase text-muted-2">No Photo</span>
        </div>
      )}
    </div>
  );
}
