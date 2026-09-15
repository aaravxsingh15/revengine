import type { Metadata } from "next";
import GarageClient from "@/components/car/GarageClient";

export const metadata: Metadata = {
  title: "My Garage",
  description: "Your saved cars, stored locally in your browser. Build a garage and compare your favorites.",
};

export default function GaragePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">My Garage</h1>
      <p className="text-muted mb-10 max-w-2xl">
        Cars you&apos;ve saved, stored locally in this browser. Select up to four to send straight to comparison.
      </p>
      <GarageClient />
    </div>
  );
}
