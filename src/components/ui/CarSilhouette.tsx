import { cn } from "@/lib/format";
import type { BodyStyle } from "@/types/car";

// Original abstract side-profile line art used as the visual placeholder
// wherever a car has no licensed photography (media.imageUrl is null for the
// entire seed dataset — real manufacturer photos aren't ours to scrape/embed).
// Shape varies by body style so the 50 cars don't all read as one silhouette;
// swapping in real photography later only requires setting media.imageUrl.

interface BodyShape {
  body: string;
  cabin?: string;
  extras?: string;
  wheels: [number, number];
  wheelRadius?: number;
}

const SHAPES: Record<string, BodyShape> = {
  Coupe: {
    body: "M20 100 C 20 80, 45 78, 65 72 C 90 55, 120 34, 150 28 C 180 22, 230 22, 260 30 C 295 38, 320 55, 345 68 C 365 72, 380 78, 382 92 L 382 100",
    cabin: "M100 72 C 115 48, 140 36, 165 34 C 190 32, 215 32, 235 38 C 250 42, 258 50, 262 60 L 100 72Z",
    wheels: [95, 305],
  },
  Sedan: {
    body: "M20 100 C 20 82, 42 80, 60 74 C 85 56, 110 36, 140 30 C 165 25, 195 24, 220 26 C 245 28, 260 34, 268 46 C 285 42, 310 48, 330 58 C 350 66, 368 74, 378 86 C 381 90, 382 94, 382 100",
    cabin: "M95 74 C 110 50, 135 38, 158 35 C 182 32, 205 32, 222 37 L 222 62 C 200 66, 150 70, 95 74 Z",
    extras: "M179 34 L 179 64",
    wheels: [98, 300],
  },
  Hatchback: {
    body: "M35 100 C 35 82, 55 80, 72 74 C 94 58, 116 38, 143 30 C 166 24, 188 24, 203 30 C 217 35, 222 45, 222 56 C 236 62, 248 70, 255 83 C 258 90, 258 96, 256 100",
    cabin: "M92 72 C 106 50, 128 38, 148 34 C 166 31, 182 32, 195 38 L 195 58 C 174 62, 128 66, 92 72 Z",
    wheels: [88, 228],
    wheelRadius: 19,
  },
  Convertible: {
    body: "M30 100 C 30 82, 50 80, 68 74 C 92 58, 118 40, 145 32 C 170 26, 200 25, 222 30 C 250 36, 275 48, 295 60 C 320 68, 345 76, 365 86 C 374 90, 379 94, 380 100",
    extras:
      "M120 70 L 150 34 M175 60 C 185 50, 205 48, 215 58 C 220 64, 214 70, 200 70 C 188 70, 178 66, 175 60 Z",
    wheels: [100, 300],
  },
  Targa: {
    body: "M30 100 C 30 82, 50 80, 68 74 C 92 58, 118 40, 145 32 C 170 26, 200 25, 222 30 C 250 36, 275 48, 295 60 C 320 68, 345 76, 365 86 C 374 90, 379 94, 380 100",
    extras:
      "M120 70 L 150 34 M175 60 C 185 50, 205 48, 215 58 C 220 64, 214 70, 200 70 C 188 70, 178 66, 175 60 Z M150 68 L 150 38 M180 68 L 180 38 M150 40 L 180 40",
    wheels: [100, 300],
  },
  Wagon: {
    body: "M20 100 C 20 82, 42 80, 60 74 C 85 56, 110 36, 140 30 C 165 25, 250 24, 285 27 C 312 29, 332 32, 344 40 C 352 46, 354 52, 354 60 L 360 60 C 368 60, 373 66, 375 76 C 377 86, 377 94, 376 100",
    cabin: "M95 74 C 110 50, 135 38, 158 35 C 200 30, 260 30, 302 35 L 302 60 C 250 64, 150 70, 95 74 Z",
    wheels: [100, 322],
  },
};

function fallbackShape(bodyStyle: string | null): BodyShape {
  if (bodyStyle && SHAPES[bodyStyle]) return SHAPES[bodyStyle];
  return SHAPES.Coupe;
}

export default function CarSilhouette({
  bodyStyle = null,
  rolling = false,
  hoverSpin = false,
  className,
}: {
  bodyStyle?: BodyStyle | null;
  rolling?: boolean;
  hoverSpin?: boolean;
  className?: string;
}) {
  const shape = fallbackShape(bodyStyle);
  const [frontX, rearX] = shape.wheels;
  const r = shape.wheelRadius ?? 20;
  const wheelClass = rolling ? "wheel-rolling" : hoverSpin ? "wheel-spin-hover" : undefined;

  return (
    <svg viewBox="0 0 400 140" fill="none" className={cn("w-full h-auto", className)} aria-hidden="true">
      <path d={shape.body} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d="M382 100 L 20 100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      {shape.cabin && (
        <path d={shape.cabin} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" opacity="0.6" />
      )}
      {shape.extras && (
        <path d={shape.extras} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      )}

      <g className={wheelClass}>
        <circle cx={frontX} cy="100" r={r} stroke="currentColor" strokeWidth="3" opacity="0.9" />
        <circle cx={frontX} cy="100" r={r * 0.4} stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <line x1={frontX} y1={100 - r} x2={frontX} y2={100 - r * 0.4} stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <line x1={frontX + r} y1="100" x2={frontX + r * 0.4} y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      </g>
      <g className={wheelClass}>
        <circle cx={rearX} cy="100" r={r} stroke="currentColor" strokeWidth="3" opacity="0.9" />
        <circle cx={rearX} cy="100" r={r * 0.4} stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <line x1={rearX} y1={100 - r} x2={rearX} y2={100 - r * 0.4} stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <line x1={rearX + r} y1="100" x2={rearX + r * 0.4} y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      </g>

      <line x1={frontX - 55} y1="86" x2={frontX - 35} y2="84" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
