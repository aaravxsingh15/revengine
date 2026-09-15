// localStorage-backed garage + recently-viewed tracking. Plain event-based
// pub/sub since there's no framework state management here.
(function (global) {
  const GARAGE_KEY = "revengine:garage";
  const RECENT_KEY = "revengine:recently-viewed";
  const RECENT_LIMIT = 12;

  function readIds(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeIds(key, ids) {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      // storage unavailable (private mode, quota) — UI still works this session
    }
    window.dispatchEvent(new CustomEvent(key));
  }

  function getGarageIds() {
    return readIds(GARAGE_KEY);
  }

  function isInGarage(id) {
    return getGarageIds().includes(id);
  }

  function toggleGarage(id) {
    const ids = getGarageIds();
    if (ids.includes(id)) writeIds(GARAGE_KEY, ids.filter((x) => x !== id));
    else writeIds(GARAGE_KEY, [...ids, id]);
  }

  function removeFromGarage(id) {
    writeIds(GARAGE_KEY, getGarageIds().filter((x) => x !== id));
  }

  function clearGarage() {
    writeIds(GARAGE_KEY, []);
  }

  function getRecentlyViewed() {
    return readIds(RECENT_KEY);
  }

  function addRecentlyViewed(id) {
    const ids = getRecentlyViewed().filter((x) => x !== id);
    ids.unshift(id);
    writeIds(RECENT_KEY, ids.slice(0, RECENT_LIMIT));
  }

  function onGarageChange(cb) {
    window.addEventListener(GARAGE_KEY, cb);
    window.addEventListener("storage", cb);
  }

  function onRecentChange(cb) {
    window.addEventListener(RECENT_KEY, cb);
    window.addEventListener("storage", cb);
  }

  global.RevGarage = {
    getGarageIds,
    isInGarage,
    toggleGarage,
    removeFromGarage,
    clearGarage,
    getRecentlyViewed,
    addRecentlyViewed,
    onGarageChange,
    onRecentChange,
  };
})(window);
