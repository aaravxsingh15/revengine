// Global search: supports partial matching across company/model/variant/
// generation. Powers both the desktop navbar search and the mobile menu
// search box.
(function () {
  function searchCars(cars, query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return cars.filter((c) => {
      const haystack = [c.company, c.model, c.variant, c.generation, `${c.company} ${c.model}`]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderResults(container, results, query) {
    if (results.length === 0) {
      container.innerHTML = `<div class="search-empty">No cars found for &ldquo;${query}&rdquo;</div>`;
      return;
    }
    const { fmt, fmtDecimal } = window.RevFormat;
    const items = results
      .slice(0, 6)
      .map(
        (car) => `
      <a href="/cars/${car.slug}" class="search-result-item">
        <div class="search-result-thumb"><div class="car-visual" data-gradient="${car.id}">${car.heroImage ? `<img src="${car.heroImage}" alt="" class="car-photo" onerror="this.remove()"/>` : ""}<div class="car-silhouette-wrap">${window.renderCarSilhouette(car.bodyStyle)}</div></div></div>
        <div class="min-w-0">
          <p style="margin:0;font-size:0.875rem;font-weight:500;">${car.company} ${car.model} ${car.generation || car.variant || ""}</p>
          <p style="margin:0;font-size:0.75rem;color:var(--muted);">${fmt(car.performance.horsepowerHp, "hp")} &middot; ${fmtDecimal(car.performance.zeroTo100Sec, "s")} 0-100 &middot; ${fmt(car.performance.topSpeedKmh, "km/h")}</p>
        </div>
      </a>`
      )
      .join("");
    container.innerHTML = `${items}<button class="search-viewall" data-view-all="${query}">View all results for &ldquo;${query}&rdquo; &rarr;</button>`;
    const viewAllBtn = container.querySelector("[data-view-all]");
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        window.location.href = `/cars?q=${encodeURIComponent(query)}`;
      });
    }
  }

  function wireSearch(rootSelector, inputSelector, resultsEl) {
    const root = document.querySelector(rootSelector);
    const input = document.querySelector(inputSelector);
    if (!root || !input || !resultsEl) return;

    let cars = null;
    input.addEventListener("input", async () => {
      const query = input.value;
      if (!query.trim()) {
        resultsEl.hidden = true;
        return;
      }
      if (!cars) cars = await window.RevCompareTray.getAllCarsCached();
      const results = searchCars(cars, query);
      renderResults(resultsEl, results, query.trim());
      resultsEl.hidden = false;
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        window.location.href = `/cars?q=${encodeURIComponent(input.value.trim())}`;
      }
    });

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target) && !resultsEl.contains(e.target)) {
        resultsEl.hidden = true;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireSearch("[data-search-root]", "[data-search-input]", document.querySelector("[data-search-results]"));

    // Mobile search just navigates on submit (no dropdown, avoids clutter
    // inside the mobile menu panel).
    const mobileInput = document.querySelector("[data-search-input-mobile]");
    if (mobileInput) {
      mobileInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && mobileInput.value.trim()) {
          window.location.href = `/cars?q=${encodeURIComponent(mobileInput.value.trim())}`;
        }
      });
    }
  });
})();
