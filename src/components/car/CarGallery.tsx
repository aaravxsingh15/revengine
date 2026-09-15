"use client";

import { useEffect, useRef, useState } from "react";
import type { BodyStyle } from "@/types/car";
import type { Car } from "@/types/car";
import CarSilhouette from "@/components/ui/CarSilhouette";
import { resolveCarImages } from "@/lib/media";

const STANDARD_ANGLES = ["Front", "Rear", "Side Profile", "Interior", "Dashboard", "Engine Bay", "Wheels", "Detail Shot"];

function GalleryTile({
  src,
  alt,
  angle,
  bodyStyle,
}: {
  src: string | null;
  alt: string;
  angle: string;
  bodyStyle: BodyStyle | null;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Same belt-and-suspenders as CarVisual: a previously-failed URL can
  // resolve as "complete" on a fresh mount without re-firing onerror.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) {
      setFailed(true);
    }
  }, [src]);

  const showImage = src && !failed;

  return (
    <div className="aspect-[4/3] rounded-xl border border-border-subtle bg-surface overflow-hidden relative carbon-texture">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-2">
          <CarSilhouette bodyStyle={bodyStyle} className="w-2/3 opacity-40" />
          <span className="text-[10px] uppercase tracking-wider">{angle}</span>
        </div>
      )}
    </div>
  );
}

// Renders real gallery photography when present (media.galleryImages, or
// falling back to the conventional /images/cars/... path from the naming
// manifest), and otherwise falls back to labeled placeholder tiles for the
// standard angle set — each slot fails over to its placeholder
// independently, so a partially-filled gallery still looks intentional.
export default function CarGallery({ car }: { car: Car }) {
  const explicitImages = car.media.galleryImages;
  const conventional = resolveCarImages(car.id)?.gallery;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STANDARD_ANGLES.map((angle, i) => (
        <GalleryTile
          key={angle}
          src={explicitImages?.[i] ?? conventional?.[i]?.url ?? null}
          alt={`${car.company} ${car.model} — ${angle}`}
          angle={angle}
          bodyStyle={car.bodyStyle}
        />
      ))}
    </div>
  );
}
