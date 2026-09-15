(function () {
  const { fmt, fmtDecimal, fmtYearRange, powerToWeight } = window.RevFormat;
  let allCars = [];
  let sortKey = "horsepower";
  let selected = [];
  let featuredId = null;

  function sortCars(cars, key) {
    const valueFor = (c) => {
      switch (key) {
        case "horsepower": return c.performance.horsepowerHp;
        case "zeroTo100": return c.performance.zeroTo100Sec;
        case "topSpeed": return c.performance.topSpeedKmh;
        case "year": return c.productionStart;
        default: return null;
      }
    };
    if (key === "manufacturer") return [...cars].sort((a, b) => a.company.localeCompare(b.company));
    const asc = key === "zeroTo100";
    const withNulls = cars.filter((c) => valueFor(c) === null);
    const withNumbers = cars.filter((c) => valueFor(c) !== null);
    withNumbers.sort((a, b) => (asc ? valueFor(a) - valueFor(b) : valueFor(b) - valueFor(a)));
    return [...withNumbers, ...withNulls];
  }

  function renderShowcase(cars) {
    if (cars.length === 0) return "";
    const car = cars.find((c) => c.id === featuredId) || cars[0];
    featuredId = car.id;
    const p = car.performance;

    const thumbs = cars.length > 1
      ? `<div class="garage-thumbs">${cars
          .map((c) => `<button class="garage-thumb ${c.id === car.id ? "active" : ""}" data-featured-id="${c.id}"><div class="car-visual" data-gradient="${c.id}">${c.heroImage ? `<img src="${c.heroImage}" class="car-photo" onerror="this.remove()"/>` : ""}<div class="car-silhouette-wrap">${window.renderCarSilhouette(c.bodyStyle)}</div></div></button>`)
          .join("")}</div>`
      : "";

    return `
    <div class="garage-showcase-panel carbon-texture">
      <div class="hero-content" style="min-height:340px;">
        <div class="hero-info">
          <div class="hero-eyebrow" style="color:var(--accent-2);">${car.country}${car.segment ? " &middot; " + car.segment : ""}</div>
          <p class="eyebrow" style="font-size:0.85rem; margin-top:0.5rem;">${car.company}</p>
          <h2 class="hero-title" style="font-size:2.2rem;">${car.model}</h2>
          <p class="hero-sub">${[car.generation, car.variant].filter(Boolean).join(" · ")} · ${fmtYearRange(car.productionStart, car.productionEnd)}</p>
          <div class="hero-actions">
            <a href="/cars/${car.slug}" class="btn btn-primary">Full Specs <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
            <button class="btn btn-secondary" data-showcase-compare="${car.slug}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3-4 4 4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg> Compare</button>
            <button class="btn btn-ghost" data-showcase-remove="${car.id}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg> Remove</button>
          </div>
        </div>
        <div class="hero-visual-wrap"><div class="hero-visual">${window.renderCarSilhouette(car.bodyStyle)}</div></div>
      </div>
      ${thumbs}
    </div>
    <div class="perf-grid">
      <div class="perf-card"><p class="perf-value">${fmt(p.horsepowerHp, "HP")}</p><p class="perf-label">Horsepower</p></div>
      <div class="perf-card"><p class="perf-value">${fmt(p.torqueNm, "Nm")}</p><p class="perf-label">Torque</p></div>
      <div class="perf-card"><p class="perf-value">${fmtDecimal(p.zeroTo100Sec, "s")}</p><p class="perf-label">0-100 km/h</p></div>
      <div class="perf-card"><p class="perf-value">${fmt(p.topSpeedKmh, "km/h")}</p><p class="perf-label">Top Speed</p></div>
      <div class="perf-card"><p class="perf-value">${fmt(p.weightKg, "kg")}</p><p class="perf-label">Weight</p></div>
      <div class="perf-card"><p class="perf-value">${fmt(powerToWeight(car), "hp/t")}</p><p class="perf-label">Power-to-Weight</p></div>
    </div>`;
  }

  function renderGrid(cars) {
    return `<div class="car-grid">${cars
      .map((car) => {
        const isSelected = selected.includes(car.slug);
        return `
      <div class="garage-card ${isSelected ? "selected" : ""}" data-garage-slug="${car.slug}">
        <button class="garage-select-btn ${isSelected ? "checked" : ""}" data-select-slug="${car.slug}" aria-label="Select for comparison"></button>
        <button class="garage-remove-btn" data-remove-id="${car.id}" aria-label="Remove from garage"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        <a href="/cars/${car.slug}" style="display:block;">
          <div class="car-card-media"><div class="car-visual" data-gradient="${car.id}">${car.heroImage ? `<img src="${car.heroImage}" class="car-photo" onerror="this.remove()"/>` : ""}<div class="car-silhouette-wrap">${window.renderCarSilhouette(car.bodyStyle)}</div></div></div>
          <div class="car-card-body">
            <p class="eyebrow">${car.company}</p>
            <h3 class="car-card-title">${car.model} ${car.generation ? `<span class="muted">${car.generation}</span>` : ""}</h3>
            <p style="font-size:0.75rem;color:var(--muted);margin:0.25rem 0 0.75rem;">${fmtYearRange(car.productionStart, car.productionEnd)}</p>
            <div class="car-card-stats">
              <div><p class="stat-value">${fmt(car.performance.horsepowerHp)}</p><p class="stat-label">HP</p></div>
              <div><p class="stat-value">${fmtDecimal(car.performance.zeroTo100Sec, "s")}</p><p class="stat-label">0-100</p></div>
              <div><p class="stat-value">${fmt(car.performance.topSpeedKmh)}</p><p class="stat-label">km/h</p></div>
            </div>
          </div>
        </a>
      </div>`;
      })
      .join("")}</div>`;
  }

  function render() {
    const root = document.getElementById("garage-root");
    const ids = window.RevGarage.getGarageIds();
    const cars = sortCars(allCars.filter((c) => ids.includes(c.id)), sortKey);

    if (cars.length === 0) {
      root.innerHTML = `<div class="empty-state">
        <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg></div>
        <h2>Your garage is empty</h2>
        <p>Save cars from the catalog to build your personal garage — click the heart icon on any car to add it here.</p>
        <a href="/cars" class="btn btn-primary">Browse cars</a>
      </div>`;
      return;
    }

    root.innerHTML = `
      <div class="garage-showcase">${renderShowcase(cars)}</div>
      <div class="garage-toolbar">
        <p class="muted">${cars.length} ${cars.length === 1 ? "car" : "cars"} saved${selected.length ? ` · ${selected.length} selected for comparison` : ""}</p>
        <div style="display:flex; gap:0.75rem; align-items:center;">
          <select class="select-pill" id="garage-sort">
            <option value="horsepower">Sort by Horsepower</option>
            <option value="zeroTo100">Sort by 0-100 km/h</option>
            <option value="topSpeed">Sort by Top Speed</option>
            <option value="year">Sort by Production Year</option>
            <option value="manufacturer">Sort by Manufacturer</option>
          </select>
          ${selected.length >= 2 ? `<a href="/compare?cars=${selected.join(",")}" class="btn btn-primary btn-sm">Compare Selected</a>` : ""}
          <button class="btn-ghost" id="garage-clear" style="font-size:0.875rem;">Clear Garage</button>
        </div>
      </div>
      ${renderGrid(cars)}
    `;

    document.getElementById("garage-sort").value = sortKey;
    document.getElementById("garage-sort").addEventListener("change", (e) => { sortKey = e.target.value; render(); });
    document.getElementById("garage-clear").addEventListener("click", () => { window.RevGarage.clearGarage(); selected = []; });

    root.querySelectorAll("[data-select-slug]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const slug = btn.dataset.selectSlug;
        if (selected.includes(slug)) selected = selected.filter((s) => s !== slug);
        else if (selected.length < 4) selected = [...selected, slug];
        render();
      });
    });
    root.querySelectorAll("[data-remove-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.RevGarage.removeFromGarage(btn.dataset.removeId);
      });
    });
    root.querySelectorAll("[data-featured-id]").forEach((btn) => {
      btn.addEventListener("click", () => { featuredId = btn.dataset.featuredId; render(); });
    });
    const showcaseCompareBtn = root.querySelector("[data-showcase-compare]");
    if (showcaseCompareBtn) showcaseCompareBtn.addEventListener("click", () => window.RevCompareTray.toggleCompareTray(showcaseCompareBtn.dataset.showcaseCompare));
    const showcaseRemoveBtn = root.querySelector("[data-showcase-remove]");
    if (showcaseRemoveBtn) showcaseRemoveBtn.addEventListener("click", () => window.RevGarage.removeFromGarage(showcaseRemoveBtn.dataset.showcaseRemove));
  }

  document.addEventListener("DOMContentLoaded", async () => {
    allCars = await window.RevCompareTray.getAllCarsCached();
    render();
  });
  window.RevGarage.onGarageChange(render);
})();
