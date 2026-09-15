// Shared localStorage-backed string-list store used by useGarage and
// useCompareTray. Centralized so both hooks get the same useSyncExternalStore
// caching fix in one place: getSnapshot must return a referentially stable
// value when nothing changed, or React re-renders forever.
const snapshotCache = new Map<string, { raw: string | null; parsed: string[] }>();

export function readIdList(key: string): string[] {
  if (typeof window === "undefined") return [];
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return [];
  }
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) return cached.parsed;

  let parsed: string[] = [];
  try {
    const value = raw ? JSON.parse(raw) : [];
    parsed = Array.isArray(value) ? value : [];
  } catch {
    parsed = [];
  }
  snapshotCache.set(key, { raw, parsed });
  return parsed;
}

export function writeIdList(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently, UI still works this session
  }
  window.dispatchEvent(new CustomEvent(key));
}

export function subscribeIdList(key: string, callback: () => void) {
  window.addEventListener(key, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(key, callback);
    window.removeEventListener("storage", callback);
  };
}

export const emptyIdList: string[] = [];
