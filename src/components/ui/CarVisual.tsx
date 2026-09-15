"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";
import CarSilhouette from "./CarSilhouette";
import { resolveCarImages } from "@/lib/media";
import type { Car } from "@/types/car";

const GRADIENTS = [
  "from-accent/25 via-surface-2 to-surface",
  "from-accent-2/20 via-surface-2 to-surface",
  "from-accent/20 via-accent-2/10 to-surface",
  "from-warning/15 via-surface-2 to-surface",
  "from-success/15 via-surface-2 to-surface",
  "from-accent-2/15 via-accent/10 to-surface",
];

function gradientFor(car: Car): string {
  const idx = parseInt(car.id, 10) % GRADIENTS.length;
  return GRADIENTS[idx];
}

export default function CarVisual({
  car,
  className,
  showLabel = true,
  hoverSpin = true,
}: {
  car: Car;
  className?: string;
  showLabel?: boolean;
  hoverSpin?: boolean;
}) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // media.imageUrl (explicitly set per car) wins if present; otherwise try
  // the conventional /images/cars/... path from the naming manifest. Either
  // way, a load failure (which is the current state for all 50 cars — no
  // licensed photos exist yet) falls back to the original SVG artwork
  // instead of a broken image icon.
  const photoUrl = car.media.imageUrl ?? resolveCarImages(car.id)?.hero ?? null;

  // Belt-and-suspenders alongside onError: if this exact URL already failed
  // earlier in the session, the browser can resolve a freshly-mounted <img>
  // as "complete" from its failed-request cache without re-firing onerror,
  // so check the already-resolved state directly on mount too.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) {
      setPhotoFailed(true);
    }
  }, [photoUrl]);

  if (photoUrl && !photoFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
        src={photoUrl}
        alt={`${car.company} ${car.model}`}
        onError={() => setPhotoFailed(true)}
        className={cn("w-full h-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br carbon-texture",
        gradientFor(car),
        className
      )}
    >
      <CarSilhouette bodyStyle={car.bodyStyle} hoverSpin={hoverSpin} className="w-[85%] text-foreground/70" />
      {showLabel && (
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between pointer-events-none">
          <span className="font-display text-xs tracking-[0.2em] uppercase text-muted">{car.company}</span>
          <span className="font-display text-xs tracking-[0.2em] uppercase text-muted-2">No Photo</span>
        </div>
      )}
    </div>
  );
}
