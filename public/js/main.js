// Mobile nav toggle + navbar garage-count badge.
(function () {
  function wireMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const isOpen = !menu.hidden;
      menu.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  function updateGarageCount() {
    const badge = document.getElementById("nav-garage-count");
    if (!badge) return;
    const count = window.RevGarage.getGarageIds().length;
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  function setFooterYear() {
    const el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireMobileMenu();
    updateGarageCount();
    setFooterYear();
  });
  window.RevGarage && window.RevGarage.onGarageChange(updateGarageCount);
})();
