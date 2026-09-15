// Client-side search/filter/sort for the /cars browse page. Mirrors the
// logic in lib/cars.js (filterCars/searchCars/sortCars) so behavior matches
// the initial server-rendered page exactly, but re-renders instantly
// without a reload as the user changes filters.
(function () {
  const PAGE_SIZE = 12;

  function searchCars(cars, query) {
    const q = query.toLowerCase().trim();
    if (!q) return cars;
    return cars.filter((c) => {
      const haystack = [c.company, c.model, c.variant, c.generation, `${c.company} ${c.model}`]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function filterCars(cars, filters) {
    return cars.filter((c) => {
      if (filters.manufacturers.length && !filters.manufacturers.includes(c.manufacturerSlug)) return false;
      if (filters.countries.length && !filters.countries.includes(c.country)) return false;
      if (filters.bodyStyles.length && !filters.bodyStyles.includes(c.bodyStyle)) return false;
      if (filters.segments.length && !filters.segments.includes(c.segment)) return false;
      if (filters.drivetrains.length && !filters.drivetrains.includes(c.transmission.drivetrain)) return false;
      if (filters.hpMin !== null && (c.performance.horsepowerHp === null || c.performance.horsepowerHp < filters.hpMin)) return false;
      if (filters.hpMax !== null && (c.performance.horsepowerHp === null || c.performance.horsepowerHp > filters.hpMax)) return false;
      return true;
    });
  }

  function sortCars(cars, key, direction) {
    if (key === "manufacturer") {
      const sorted = [...cars].sort((a, b) => a.company.localeCompare(b.company));
      return direction === "desc" ? sorted.reverse() : sorted;
    }
    const valueFor = (c) => {
      switch (key) {
        case "horsepower": return c.performance.horsepowerHp;
        case "torque": return c.performance.torqueNm;
        case "zeroTo100": return c.performance.zeroTo100Sec;
        case "topSpeed": return c.performance.topSpeedKmh;
        case "weight": return c.performance.weightKg;
        case "year": return c.productionStart;
        default: return null;
      }
    };
    const withNulls = cars.filter((c) => valueFor(c) === null);
    const withNumbers = cars.filter((c) => valueFor(c) !== null);
    withNumbers.sort((a, b) => (direction === "asc" ? valueFor(a) - valueFor(b) : valueFor(b) - valueFor(a)));
    return [...withNumbers, ...withNulls];
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("car-grid");
    const resultsCount = document.getElementById("results-count");
    const loadMoreBtn = document.getElementById("load-more-btn");
    const emptyState = document.getElementById("empty-state");
    const searchInput = document.getElementById("browse-search-input");
    const sortSelect = document.getElementById("sort-select");
    const hpMinInput = document.getElementById("filter-hpMin");
    const hpMaxInput = document.getElementById("filter-hpMax");
    const filterClearBtn = document.getElementById("filter-clear");

    const allCars = await window.RevCompareTray.getAllCarsCached();
    let visibleCount = PAGE_SIZE;

    function currentFilters() {
      const checked = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((i) => i.value);
      return {
        manufacturers: checked("manufacturer"),
        countries: checked("country"),
        bodyStyles: checked("bodyStyle"),
        segments: checked("segment"),
        drivetrains: checked("drivetrain"),
        hpMin: hpMinInput.value ? Number(hpMinInput.value) : null,
        hpMax: hpMaxInput.value ? Number(hpMaxInput.value) : null,
      };
    }

    function activeFilterCount(filters) {
      return (
        filters.manufacturers.length +
        filters.countries.length +
        filters.bodyStyles.length +
        filters.segments.length +
        filters.drivetrains.length +
        (filters.hpMin !== null ? 1 : 0) +
        (filters.hpMax !== null ? 1 : 0)
      );
    }

    function render() {
      const filters = currentFilters();
      const [sortKey, direction] = sortSelect.value.split(":");
      const base = searchCars(allCars, searchInput.value);
      const filtered = filterCars(base, filters);
      const results = sortCars(filtered, sortKey, direction);

      resultsCount.textContent = `${results.length} of ${allCars.length} cars match your search`;
      filterClearBtn.hidden = activeFilterCount(filters) === 0;

      if (results.length === 0) {
        grid.innerHTML = "";
        loadMoreBtn.hidden = true;
        emptyState.hidden = false;
        emptyState.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
            <h2>${searchInput.value ? `No results for "${searchInput.value}"` : "No cars match these filters"}</h2>
            <p>Try a different search term, or clear your filters to see the full RevEngine catalog.</p>
          </div>`;
        return;
      }

      emptyState.hidden = true;
      const visible = results.slice(0, visibleCount);
      grid.innerHTML = visible.map((car) => window.renderCarCard(car)).join("");
      window.refreshCardActionStates();

      loadMoreBtn.hidden = visibleCount >= results.length;
      loadMoreBtn.textContent = `Load More (${results.length - visibleCount} remaining)`;
    }

    searchInput.addEventListener("input", () => { visibleCount = PAGE_SIZE; render(); });
    sortSelect.addEventListener("change", render);
    hpMinInput.addEventListener("input", () => { visibleCount = PAGE_SIZE; render(); });
    hpMaxInput.addEventListener("input", () => { visibleCount = PAGE_SIZE; render(); });
    document.querySelectorAll('.filter-checkbox-list input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => { visibleCount = PAGE_SIZE; render(); });
    });
    loadMoreBtn.addEventListener("click", () => { visibleCount += PAGE_SIZE; render(); });
    filterClearBtn.addEventListener("click", () => {
      document.querySelectorAll('.filter-checkbox-list input[type="checkbox"]').forEach((cb) => (cb.checked = false));
      hpMinInput.value = "";
      hpMaxInput.value = "";
      visibleCount = PAGE_SIZE;
      render();
    });

    // Collapsible filter sections.
    document.querySelectorAll("[data-filter-section]").forEach((section) => {
      section.querySelector("[data-toggle]").addEventListener("click", () => {
        section.classList.toggle("open");
      });
    });

    render();
  });
})();
