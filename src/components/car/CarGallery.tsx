import type { Car } from "@/types/car";
import CarSilhouette from "@/components/ui/CarSilhouette";

const STANDARD_ANGLES = ["Front", "Rear", "Side Profile", "Interior", "Dashboard", "Engine Bay", "Wheels", "Detail Shot"];

// Renders real gallery photography when present (media.galleryImages), and
// otherwise falls back to labeled placeholder tiles for the standard angle
// set so the grid slot layout is already in place — adding real photos later
// is just populating media.galleryImages, no component changes needed.
export default function CarGallery({ car }: { car: Car }) {
  const images = car.media.galleryImages;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STANDARD_ANGLES.map((angle, i) => {
        const src = images?.[i];
        return (
          <div key={angle} className="aspect-[4/3] rounded-xl border border-border-subtle bg-surface overflow-hidden relative carbon-texture">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={`${car.company} ${car.model} — ${angle}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-2">
                <CarSilhouette className="w-2/3 opacity-40" />
                <span className="text-[10px] uppercase tracking-wider">{angle}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
