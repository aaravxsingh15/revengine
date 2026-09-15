"use client";

import { useSyncExternalStore } from "react";
import { readIdList, writeIdList, subscribeIdList, emptyIdList } from "@/lib/idListStore";

// A lightweight, cross-page "selection tray" so a user can pick cars to
// compare from the browse grid, search results, a car page, or the garage,
// then land on /compare with all of them preloaded. Capped at 4 per the
// comparison system's max. The /compare page itself is the source of truth
// once loaded (driven by the ?cars= URL for shareability) — this tray only
// exists to get the user there.
const TRAY_KEY = "revengine:compare-tray";
const MAX_COMPARE = 4;

export function useCompareTrayIds(): string[] {
  return useSyncExternalStore(
    (cb) => subscribeIdList(TRAY_KEY, cb),
    () => readIdList(TRAY_KEY),
    () => emptyIdList
  );
}

export function toggleCompareTray(slug: string): boolean {
  const ids = readIdList(TRAY_KEY);
  if (ids.includes(slug)) {
    writeIdList(TRAY_KEY, ids.filter((x) => x !== slug));
    return false;
  }
  if (ids.length >= MAX_COMPARE) return false;
  writeIdList(TRAY_KEY, [...ids, slug]);
  return true;
}

export function removeFromCompareTray(slug: string) {
  writeIdList(TRAY_KEY, readIdList(TRAY_KEY).filter((x) => x !== slug));
}

export function clearCompareTray() {
  writeIdList(TRAY_KEY, []);
}

export { MAX_COMPARE };
