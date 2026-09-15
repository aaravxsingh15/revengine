// Cross-page "add to compare" selection tray (localStorage), rendered as a
// floating bar. Capped at 4 to match the comparison system's max.
(function (global) {
  const TRAY_KEY = "revengine:compare-tray";
  const MAX_COMPARE = 4;

  function readIds() {
    try {
      const raw = localStorage.getItem(TRAY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeIds(ids) {
    try {
      localStorage.setItem(TRAY_KEY, JSON.stringify(ids));
    } catch {
      // ignore storage failures, tray just won't persist this session
    }
    window.dispatchEvent(new CustomEvent(TRAY_KEY));
  }

  function getCompareTray() {
    return readIds();
  }

  function isInCompareTray(slug) {
    return readIds().includes(slug);
  }

  function toggleCompareTray(slug) {
    const ids = readIds();
    if (ids.includes(slug)) {
      writeIds(ids.filter((x) => x !== slug));
      return false;
    }
    if (ids.length >= MAX_COMPARE) return false;
    writeIds([...ids, slug]);
    return true;
  }

  function removeFromCompareTray(slug) {
    writeIds(readIds().filter((x) => x !== slug));
  }

  function clearCompareTray() {
    writeIds([]);
  }

  function onTrayChange(cb) {
    window.addEventListener(TRAY_KEY, cb);
    window.addEventListener("storage", cb);
  }

  global.RevCompareTray = {
    MAX_COMPARE,
    getCompareTray,
    isInCompareTray,
    toggleCompareTray,
    removeFromCompareTray,
    clearCompareTray,
    onTrayChange,
  };

  // ---- Floating bar rendering (needs the full car dataset from /api/cars.json) ----
  let allCarsCache = null;
  async function getAllCarsCached() {
    if (allCarsCache) return allCarsCache;
    const res = await fetch("/api/cars.json");
    allCarsCache = await res.json();
    return allCarsCache;
  }
  global.RevCompareTray.getAllCarsCached = getAllCarsCached;

  async function renderTray() {
    const el = document.getElementById("compare-tray");
    if (!el) return;
    const slugs = getCompareTray();
    if (slugs.length === 0) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    const allCars = await getAllCarsCached();
    const cars = slugs.map((s) => allCars.find((c) => c.slug === s)).filter(Boolean);

    const chips = cars
      .map(
        (c) => `<span class="compare-tray-chip">${c.company} ${c.model}<button data-remove-compare="${c.slug}" aria-label="Remove ${c.model}">&times;</button></span>`
      )
      .join("");

    const canCompare = cars.length >= 2;
    el.hidden = false;
    el.innerHTML = `
      <div class="compare-tray-inner glass-panel">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2"><path d="m8 3-4 4 4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
        <div class="compare-tray-chips">${chips}${cars.length < 2 ? '<span class="compare-tray-hint">Add at least 1 more car</span>' : ""}</div>
        <button class="btn-ghost" id="compare-tray-clear" style="font-size:0.75rem;">Clear</button>
        <a href="/compare?cars=${cars.map((c) => c.slug).join(",")}" class="btn btn-primary btn-sm" style="${canCompare ? "" : "opacity:.4;pointer-events:none;"}">Compare</a>
      </div>`;

    el.querySelectorAll("[data-remove-compare]").forEach((btn) => {
      btn.addEventListener("click", () => removeFromCompareTray(btn.dataset.removeCompare));
    });
    const clearBtn = document.getElementById("compare-tray-clear");
    if (clearBtn) clearBtn.addEventListener("click", clearCompareTray);
  }

  document.addEventListener("DOMContentLoaded", renderTray);
  onTrayChange(renderTray);
})(window);
