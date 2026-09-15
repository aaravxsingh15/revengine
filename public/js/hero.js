// Homepage hero showcase: rotates through a curated set of cars, rolling
// the silhouette in on each change (wheel-rotation CSS animation synced to
// a horizontal slide), with drag/swipe navigation and autoplay.
(function () {
  const AUTO_ADVANCE_MS = 6500;
  const SWIPE_THRESHOLD = 60;

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("hero-showcase");
    if (!root) return;

    const cars = JSON.parse(root.dataset.cars || "[]");
    if (cars.length === 0) return;

    const infoEl = document.getElementById("hero-info");
    const visualEl = document.getElementById("hero-visual");
    const dotsEl = document.getElementById("hero-dots");
    const prevBtn = document.getElementById("hero-prev");
    const nextBtn = document.getElementById("hero-next");

    let index = 0;
    let paused = false;
    let dragStartX = null;
    const { fmt, fmtDecimal, fmtYearRange } = window.RevFormat;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function renderDots() {
      dotsEl.innerHTML = cars
        .map((c, i) => `<button class="hero-dot ${i === index ? "active" : ""}" data-i="${i}" aria-label="Show ${c.company} ${c.model}" aria-current="${i === index}"></button>`)
        .join("");
      dotsEl.querySelectorAll(".hero-dot").forEach((btn) => {
        btn.addEventListener("click", () => goTo(Number(btn.dataset.i)));
      });
    }

    function renderInfo(car) {
      const p = car.performance;
      infoEl.innerHTML = `
        <p class="hero-eyebrow">Featured &middot; ${car.country}</p>
        <h1 class="hero-title">${car.company}<br/><span class="text-gradient">${car.model}</span></h1>
        <p class="hero-sub">${[car.generation, car.variant].filter(Boolean).join(" · ") || car.segment} · ${fmtYearRange(car.productionStart, car.productionEnd)}</p>
        <div class="hero-stats">
          <div><p class="hero-stat-value">${fmt(p.horsepowerHp)} HP</p><p class="hero-stat-label">Horsepower</p></div>
          <div><p class="hero-stat-value">${fmt(p.torqueNm)} Nm</p><p class="hero-stat-label">Torque</p></div>
          <div><p class="hero-stat-value">${fmtDecimal(p.zeroTo100Sec, "s")}</p><p class="hero-stat-label">0-100 km/h</p></div>
          <div><p class="hero-stat-value">${fmt(p.topSpeedKmh)} km/h</p><p class="hero-stat-label">Top Speed</p></div>
        </div>
        <div class="hero-actions">
          <a href="/cars/${car.slug}" class="btn btn-primary">Explore Car <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          <button class="btn btn-secondary" data-hero-compare="${car.slug}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3-4 4 4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg> Compare</button>
        </div>`;
      const compareBtn = infoEl.querySelector("[data-hero-compare]");
      if (compareBtn) compareBtn.addEventListener("click", () => window.RevCompareTray.toggleCompareTray(compareBtn.dataset.heroCompare));
    }

    function renderVisual(rolling) {
      visualEl.classList.remove("wheel-rolling");
      visualEl.innerHTML = window.renderCarSilhouette(cars[index].bodyStyle);
      if (rolling && !prefersReducedMotion) {
        // Force reflow so the animation class re-triggers on every change.
        void visualEl.offsetWidth;
        visualEl.classList.add("wheel-rolling");
      }
    }

    function render(rolling) {
      renderInfo(cars[index]);
      renderVisual(rolling);
      renderDots();
    }

    function goTo(i) {
      index = (i + cars.length) % cars.length;
      render(true);
    }

    function advance() {
      goTo(index + 1);
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    root.addEventListener("mouseenter", () => (paused = true));
    root.addEventListener("mouseleave", () => (paused = false));

    // Drag / swipe on the visual panel.
    function onDragStart(x) {
      dragStartX = x;
      visualEl.classList.add("dragging");
    }
    function onDragEnd(x) {
      if (dragStartX === null) return;
      const delta = x - dragStartX;
      if (delta <= -SWIPE_THRESHOLD) goTo(index + 1);
      else if (delta >= SWIPE_THRESHOLD) goTo(index - 1);
      dragStartX = null;
      visualEl.classList.remove("dragging");
    }
    visualEl.addEventListener("mousedown", (e) => onDragStart(e.clientX));
    window.addEventListener("mouseup", (e) => onDragEnd(e.clientX));
    visualEl.addEventListener(
      "touchstart",
      (e) => onDragStart(e.touches[0].clientX),
      { passive: true }
    );
    visualEl.addEventListener(
      "touchend",
      (e) => onDragEnd(e.changedTouches[0].clientX),
      { passive: true }
    );

    if (!prefersReducedMotion) {
      setInterval(() => {
        if (!paused) advance();
      }, AUTO_ADVANCE_MS);
    }

    render(false);
  });
})();
