import { cn } from "@/lib/format";

// Generic side-profile sports-car line art used as the visual placeholder
// wherever a car has no photography yet (media.imageUrl is null for the
// entire seed dataset). Deliberately abstract rather than a real car photo —
// swapping in real photography later only requires setting media.imageUrl.
export default function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 140"
      fill="none"
      className={cn("w-full h-auto", className)}
      aria-hidden="true"
    >
      <path
        d="M20 100 C 20 80, 45 78, 65 72 C 90 55, 120 34, 150 28 C 180 22, 230 22, 260 30 C 295 38, 320 55, 345 68 C 365 72, 380 78, 382 92 L 382 100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M382 100 L 20 100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M100 72 C 115 48, 140 36, 165 34 C 190 32, 215 32, 235 38 C 250 42, 258 50, 262 60 L 100 72Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <circle cx="95" cy="100" r="20" stroke="currentColor" strokeWidth="3" opacity="0.9" />
      <circle cx="95" cy="100" r="8" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <circle cx="305" cy="100" r="20" stroke="currentColor" strokeWidth="3" opacity="0.9" />
      <circle cx="305" cy="100" r="8" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <line x1="40" y1="86" x2="60" y2="84" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
