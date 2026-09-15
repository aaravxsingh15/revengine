import { IMAGE_MANIFEST } from "@/data/imageManifest";

const IMAGE_BASE = "/images/cars";

export interface ResolvedCarImages {
  hero: string;
  gallery: { label: string; url: string }[];
}

// Resolves the conventional photo paths for a car from the naming manifest.
// These paths are not guaranteed to exist yet — nothing is copied/scraped
// into this repo, so every path 404s until a real, properly-licensed photo
// is placed at public/images/cars/<folder>/<file>.jpg (see image-sourcing/).
// Callers must render with an onError fallback (see CarVisual, CarGallery).
export function resolveCarImages(carId: string): ResolvedCarImages | null {
  const entry = IMAGE_MANIFEST[carId];
  if (!entry) return null;

  return {
    hero: `${IMAGE_BASE}/${entry.hero}`,
    gallery: [
      { label: "Front", url: `${IMAGE_BASE}/${entry.front}` },
      { label: "Rear", url: `${IMAGE_BASE}/${entry.rear}` },
      { label: "Side Profile", url: `${IMAGE_BASE}/${entry.side}` },
      { label: "Interior", url: `${IMAGE_BASE}/${entry.interior}` },
      { label: "Dashboard", url: `${IMAGE_BASE}/${entry.dashboard}` },
      { label: "Engine Bay", url: `${IMAGE_BASE}/${entry.engine}` },
      { label: "Wheels", url: `${IMAGE_BASE}/${entry.wheels}` },
      { label: "Detail Shot", url: `${IMAGE_BASE}/${entry.detail}` },
    ],
  };
}
