"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/hooks/useGarage";

export default function RecentlyViewedTracker({ carId }: { carId: string }) {
  useEffect(() => {
    addRecentlyViewed(carId);
  }, [carId]);

  return null;
}
