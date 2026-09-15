document.addEventListener("DOMContentLoaded", async () => {
  const section = document.getElementById("recently-viewed-section");
  const grid = document.getElementById("recently-viewed-grid");
  if (!section || !grid) return;

  const ids = window.RevGarage.getRecentlyViewed();
  if (ids.length === 0) return;

  const allCars = await window.RevCompareTray.getAllCarsCached();
  const cars = ids.map((id) => allCars.find((c) => c.id === id)).filter(Boolean).slice(0, 4);
  if (cars.length === 0) return;

  grid.innerHTML = cars.map((c) => window.renderCarCard(c)).join("");
  window.refreshCardActionStates();
  section.hidden = false;
});
