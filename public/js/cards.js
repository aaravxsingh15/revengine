// Client-side twin of views/partials/car-card.ejs. Used wherever a card
// needs to be rendered/re-rendered in the browser (browse page filtering,
// garage grid, compare picker results) without a full page reload.
(function (global) {
  const { fmt, fmtDecimal, fmtYearRange } = window.RevFormat;

  function renderCarCard(car, opts) {
    opts = opts || {};
    // heroImage is resolved server-side (see /api/cars.json) so the browser
    // never needs its own copy of the image-naming manifest.
    const photoSrc = (car.media && car.media.imageUrl) || car.heroImage || null;
    const inGarage = window.RevGarage.isInGarage(car.id);
    const inCompare = window.RevCompareTray.isInCompareTray(car.slug);
    const badge =
      car.productionStatus === "in_production"
        ? '<span class="badge-pill badge-success card-badge">In Production</span>'
        : "";
    const genOrVariant = car.generation
      ? `<span class="muted">${car.generation}</span>`
      : car.variant
      ? `<span class="muted">${car.variant}</span>`
      : "";

    return `
    <div class="car-card" data-car-id="${car.id}" data-car-slug="${car.slug}">
      <a href="/cars/${car.slug}" class="car-card-link" aria-label="View ${car.company} ${car.model} specs">
        <div class="car-card-media">
          <div class="car-visual" data-body-style="${car.bodyStyle || "Coupe"}" data-gradient="${car.id}">
            ${photoSrc ? `<img src="${photoSrc}" alt="${car.company} ${car.model}" class="car-photo" onerror="this.closest('.car-visual').classList.add('photo-failed'); this.remove();" />` : ""}
            <div class="car-silhouette-wrap">${window.renderCarSilhouette(car.bodyStyle)}</div>
            <div class="car-visual-label"><span>${car.company}</span><span class="muted-2">No Photo</span></div>
          </div>
          ${badge}
        </div>
        <div class="car-card-body">
          <div class="car-card-heading">
            <div class="min-w-0">
              <p class="eyebrow">${car.company}</p>
              <h3 class="car-card-title">${car.model} ${genOrVariant}</h3>
            </div>
            <span class="car-card-years">${fmtYearRange(car.productionStart, car.productionEnd)}</span>
          </div>
          <div class="car-card-stats">
            <div><p class="stat-value">${fmt(car.performance.horsepowerHp)}</p><p class="stat-label">HP</p></div>
            <div><p class="stat-value">${fmtDecimal(car.performance.zeroTo100Sec, "s")}</p><p class="stat-label">0-100</p></div>
            <div><p class="stat-value">${fmt(car.performance.topSpeedKmh, "km/h")}</p><p class="stat-label">Top Speed</p></div>
          </div>
        </div>
      </a>
      ${opts.hideActions ? "" : `
      <div class="car-card-actions">
        <button class="icon-btn garage-toggle ${inGarage ? "is-active" : ""}" data-garage-id="${car.id}" aria-label="Add to garage" title="Add to garage">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${inGarage ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6Z"/></svg>
        </button>
        <button class="icon-btn compare-toggle ${inCompare ? "is-active" : ""}" data-compare-slug="${car.slug}" aria-label="Add to comparison" title="Add to comparison">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3-4 4 4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
        </button>
      </div>`}
    </div>`;
  }

  // Event delegation for garage/compare buttons on any dynamically-rendered
  // card, plus the ones EJS already rendered server-side on first paint.
  document.addEventListener("click", (e) => {
    const garageBtn = e.target.closest(".garage-toggle");
    if (garageBtn) {
      e.preventDefault();
      window.RevGarage.toggleGarage(garageBtn.dataset.garageId);
      return;
    }
    const compareBtn = e.target.closest(".compare-toggle");
    if (compareBtn) {
      e.preventDefault();
      window.RevCompareTray.toggleCompareTray(compareBtn.dataset.compareSlug);
      return;
    }
  });

  function refreshCardActionStates() {
    document.querySelectorAll(".garage-toggle").forEach((btn) => {
      const active = window.RevGarage.isInGarage(btn.dataset.garageId);
      btn.classList.toggle("is-active", active);
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", active ? "currentColor" : "none");
    });
    document.querySelectorAll(".compare-toggle").forEach((btn) => {
      btn.classList.toggle("is-active", window.RevCompareTray.isInCompareTray(btn.dataset.compareSlug));
    });
  }

  document.addEventListener("DOMContentLoaded", refreshCardActionStates);
  window.RevGarage.onGarageChange(refreshCardActionStates);
  window.RevCompareTray.onTrayChange(refreshCardActionStates);

  global.renderCarCard = renderCarCard;
  global.refreshCardActionStates = refreshCardActionStates;
})(window);
