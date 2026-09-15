"use client";

import { useSyncExternalStore } from "react";
import { readIdList, writeIdList, subscribeIdList, emptyIdList } from "@/lib/idListStore";

// localStorage-backed garage + recently-viewed tracking. Deliberately kept
// behind this hook module (not scattered `localStorage.getItem` calls) so
// this is the one seam to swap for real user-account persistence later.
const GARAGE_KEY = "revengine:garage";
const RECENT_KEY = "revengine:recently-viewed";
const RECENT_LIMIT = 12;

export function useGarageIds(): string[] {
  return useSyncExternalStore(
    (cb) => subscribeIdList(GARAGE_KEY, cb),
    () => readIdList(GARAGE_KEY),
    () => emptyIdList
  );
}

export function useRecentlyViewedIds(): string[] {
  return useSyncExternalStore(
    (cb) => subscribeIdList(RECENT_KEY, cb),
    () => readIdList(RECENT_KEY),
    () => emptyIdList
  );
}

export function addToGarage(id: string) {
  const ids = readIdList(GARAGE_KEY);
  if (!ids.includes(id)) writeIdList(GARAGE_KEY, [...ids, id]);
}

export function removeFromGarage(id: string) {
  writeIdList(GARAGE_KEY, readIdList(GARAGE_KEY).filter((x) => x !== id));
}

export function toggleGarage(id: string) {
  const ids = readIdList(GARAGE_KEY);
  if (ids.includes(id)) writeIdList(GARAGE_KEY, ids.filter((x) => x !== id));
  else writeIdList(GARAGE_KEY, [...ids, id]);
}

export function clearGarage() {
  writeIdList(GARAGE_KEY, []);
}

export function addRecentlyViewed(id: string) {
  const ids = readIdList(RECENT_KEY).filter((x) => x !== id);
  ids.unshift(id);
  writeIdList(RECENT_KEY, ids.slice(0, RECENT_LIMIT));
}
