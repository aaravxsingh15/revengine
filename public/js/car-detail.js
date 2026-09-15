document.addEventListener("DOMContentLoaded", () => {
  const carId = document.getElementById("car-hero-media")?.dataset.carId;
  if (carId) window.RevGarage.addRecentlyViewed(carId);

  // Hero garage/compare buttons (separate ids from the delegated .garage-toggle
  // handler in cards.js since these live outside a car-card element).
  const garageBtn = document.getElementById("hero-garage-btn");
  const compareBtn = document.getElementById("hero-compare-btn");

  function refreshHeroButtons() {
    if (garageBtn) {
      const active = window.RevGarage.isInGarage(garageBtn.dataset.garageId);
      garageBtn.classList.toggle("btn-primary", active);
      garageBtn.classList.toggle("btn-secondary", !active);
      garageBtn.lastChild.textContent = active ? " In Garage" : " Add to Garage";
    }
    if (compareBtn) {
      const active = window.RevCompareTray.isInCompareTray(compareBtn.dataset.compareSlug);
      compareBtn.classList.toggle("is-active", active);
      compareBtn.lastChild.textContent = active ? " In Comparison" : " Add to Compare";
    }
  }

  if (garageBtn) garageBtn.addEventListener("click", () => window.RevGarage.toggleGarage(garageBtn.dataset.garageId));
  if (compareBtn) compareBtn.addEventListener("click", () => window.RevCompareTray.toggleCompareTray(compareBtn.dataset.compareSlug));
  window.RevGarage.onGarageChange(refreshHeroButtons);
  window.RevCompareTray.onTrayChange(refreshHeroButtons);
  refreshHeroButtons();

  // Animate the "relative to database" stat bars into view.
  document.querySelectorAll(".stat-bar-fill").forEach((bar) => {
    const value = Number(bar.dataset.barValue);
    const max = Number(bar.dataset.barMax);
    const pct = max > 0 ? Math.min(100, Math.max(value > 0 ? 2 : 0, (value / max) * 100)) : 0;
    requestAnimationFrame(() => {
      bar.style.width = pct + "%";
    });
  });

  // Gallery tiles: try the photo, fall back to the SVG placeholder tile.
  document.querySelectorAll("[data-gallery-tile]").forEach((tile) => {
    const src = tile.dataset.src;
    const angle = tile.dataset.angle;
    const bodyStyle = tile.dataset.bodyStyle;
    const img = new Image();
    img.onload = () => {
      tile.innerHTML = `<img src="${src}" alt="${angle}" />`;
    };
    img.onerror = () => {
      tile.innerHTML = `<div class="gallery-tile-empty">${window.renderCarSilhouette(bodyStyle)}<span>${angle}</span></div>`;
    };
    img.src = src;
  });
});
