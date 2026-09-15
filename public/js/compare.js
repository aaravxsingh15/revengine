(function () {
  const MAX_COMPARE = 4;
  const { fmt, fmtDecimal, fmtCurrency, fmtYearRange, powerToWeight } = window.RevFormat;

  const COMPARISON_METRICS = [
    { key: "horsepower", label: "Horsepower", unit: "hp", direction: "higher_is_better", get: (c) => c.performance.horsepowerHp },
    { key: "torque", label: "Torque", unit: "Nm", direction: "higher_is_better", get: (c) => c.performance.torqueNm },
    { key: "zeroTo100", label: "0-100 km/h", unit: "s", direction: "lower_is_better", get: (c) => c.performance.zeroTo100Sec },
    { key: "zeroTo200", label: "0-200 km/h", unit: "s", direction: "lower_is_better", get: (c) => c.performance.zeroTo200Sec },
    { key: "quarterMile", label: "Quarter Mile", unit: "s", direction: "lower_is_better", get: (c) => c.performance.quarterMileSec },
    { key: "topSpeed", label: "Top Speed", unit: "km/h", direction: "higher_is_better", get: (c) => c.performance.topSpeedKmh },
    { key: "weight", label: "Weight", unit: "kg", direction: "lower_is_better", get: (c) => c.performance.weightKg },
    { key: "powerToWeight", label: "Power-to-Weight", unit: "hp/t", direction: "higher_is_better", get: (c) => powerToWeight(c) },
    { key: "braking", label: "Braking 100-0", unit: "m", direction: "lower_is_better", get: (c) => c.performance.braking100To0M },
  ];

  function fmtMetric(value, unit) {
    if (value === null || value === undefined) return "N/A";
    return unit === "s" || unit === "m" ? fmtDecimal(value, unit) : fmt(value, unit);
  }

  function getWinnerIds(cars, metric) {
    const values = cars.map((c) => ({ id: c.id, value: metric.get(c) })).filter((v) => v.value !== null && v.value !== undefined);
    if (values.length === 0) return new Set();
    const best = metric.direction === "higher_is_better" ? Math.max(...values.map((v) => v.value)) : Math.min(...values.map((v) => v.value));
    return new Set(values.filter((v) => v.value === best).map((v) => v.id));
  }

  function getRadarAxes(car, all) {
    const maxOf = (fn) => { const vs = all.map(fn).filter((v) => v !== null && v > 0); return vs.length ? Math.max(...vs) : 0; };
    const minOf = (fn) => { const vs = all.map(fn).filter((v) => v !== null && v > 0); return vs.length ? Math.min(...vs) : 0; };
    const higher = (v, max) => (v === null || max === 0 ? 0 : Math.round((v / max) * 100));
    const lower = (v, min) => (v === null || v === 0 || min === 0 ? 0 : Math.round((min / v) * 100));
    const maxHp = maxOf((c) => c.performance.horsepowerHp);
    const minZero = minOf((c) => c.performance.zeroTo100Sec);
    const maxTop = maxOf((c) => c.performance.topSpeedKmh);
    const minWeight = minOf((c) => c.performance.weightKg);
    const maxPtw = maxOf((c) => powerToWeight(c));
    return [
      { key: "power", label: "Power", score: higher(car.performance.horsepowerHp, maxHp) },
      { key: "accel", label: "Acceleration", score: lower(car.performance.zeroTo100Sec, minZero) },
      { key: "topSpeed", label: "Top Speed", score: higher(car.performance.topSpeedKmh, maxTop) },
      { key: "weightEff", label: "Weight Efficiency", score: lower(car.performance.weightKg, minWeight) },
      { key: "ptw", label: "Power-to-Weight", score: higher(powerToWeight(car), maxPtw) },
    ];
  }

  function getUrlSlugs() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("cars") || "").split(",").map((s) => s.trim()).filter(Boolean);
  }

  function setUrlSlugs(slugs) {
    const url = slugs.length ? `/compare?cars=${slugs.join(",")}` : "/compare";
    window.history.replaceState({}, "", url);
  }

  let allCars = [];

  function renderSlots(cars, slugs) {
    const el = document.getElementById("compare-slots");
    const cards = cars
      .map(
        (car) => `
      <div class="compare-slot">
        <button class="compare-slot-remove" data-remove-slug="${car.slug}" aria-label="Remove ${car.model}">&times;</button>
        <div class="compare-slot-media"><div class="car-visual" data-gradient="${car.id}">${car.heroImage ? `<img src="${car.heroImage}" alt="" class="car-photo" onerror="this.remove()"/>` : ""}<div class="car-silhouette-wrap">${window.renderCarSilhouette(car.bodyStyle)}</div></div></div>
        <div class="compare-slot-body">
          <p class="eyebrow">${car.company}</p>
          <p style="font-family:var(--font-display);font-weight:600;">${car.model}</p>
        </div>
      </div>`
      )
      .join("");

    const pickerHtml =
      cars.length < MAX_COMPARE
        ? `<div class="compare-picker" id="compare-picker">
        <div class="compare-picker-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg></div>
        <p style="font-weight:500;margin-bottom:0.75rem;">Add a car to compare</p>
        <input type="text" placeholder="Search cars..." id="compare-picker-input" autocomplete="off" />
        <div class="compare-picker-results" id="compare-picker-results" hidden></div>
      </div>`
        : "";

    el.innerHTML = cards + pickerHtml;

    el.querySelectorAll("[data-remove-slug]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = slugs.filter((s) => s !== btn.dataset.removeSlug);
        setUrlSlugs(next);
        renderAll();
      });
    });

    const pickerInput = document.getElementById("compare-picker-input");
    if (pickerInput) {
      pickerInput.addEventListener("input", () => {
        const q = pickerInput.value.toLowerCase().trim();
        const resultsEl = document.getElementById("compare-picker-results");
        if (!q) { resultsEl.hidden = true; return; }
        const matches = allCars
          .filter((c) => !slugs.includes(c.slug))
          .filter((c) => `${c.company} ${c.model} ${c.variant || ""} ${c.generation || ""}`.toLowerCase().includes(q))
          .slice(0, 6);
        resultsEl.hidden = false;
        resultsEl.innerHTML = matches
          .map((c) => `<button data-add-slug="${c.slug}" style="display:flex;align-items:center;gap:0.5rem;width:100%;padding:0.5rem 0.75rem;background:none;border:none;color:var(--foreground);text-align:left;">${c.company} ${c.model}</button>`)
          .join("") || `<div style="padding:0.75rem;color:var(--muted);font-size:0.8rem;">No matches</div>`;
        resultsEl.querySelectorAll("[data-add-slug]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const next = [...slugs, btn.dataset.addSlug];
            setUrlSlugs(next);
            renderAll();
          });
          btn.addEventListener("mouseenter", () => (btn.style.background = "var(--surface-3)"));
          btn.addEventListener("mouseleave", () => (btn.style.background = "none"));
        });
      });
    }
  }

  function renderHeadToHead(cars) {
    if (cars.length !== 2) return "";
    const [a, b] = cars;
    const rows = COMPARISON_METRICS.slice(0, 6)
      .map((m) => {
        const av = m.get(a);
        const bv = m.get(b);
        const aWins = av !== null && (bv === null || (m.direction === "higher_is_better" ? av > bv : av < bv));
        const bWins = bv !== null && (av === null || (m.direction === "higher_is_better" ? bv > av : bv < av));
        return `<div class="h2h-row">
          <span class="h2h-val left ${aWins ? "winner" : ""}">${fmtMetric(av, m.unit)}</span>
          <span class="h2h-label">${m.label}</span>
          <span class="h2h-val ${bWins ? "winner" : ""}">${fmtMetric(bv, m.unit)}</span>
        </div>`;
      })
      .join("");
    return `<div class="head-to-head">
      <div class="h2h-title"><h3>${a.company} ${a.model}</h3><span class="h2h-vs">VS</span><h3>${b.company} ${b.model}</h3></div>
      ${rows}
    </div>`;
  }

  function renderTable(cars) {
    const infoRows = [
      { label: "Manufacturer", get: (c) => c.company },
      { label: "Model", get: (c) => [c.model, c.generation, c.variant].filter(Boolean).join(" ") },
      { label: "Production Years", get: (c) => fmtYearRange(c.productionStart, c.productionEnd) },
      { label: "Country", get: (c) => c.country },
      { label: "Engine", get: (c) => c.engine.name || c.engine.configuration || "N/A" },
      { label: "Configuration", get: (c) => c.engine.configuration || "N/A" },
      { label: "Aspiration", get: (c) => c.engine.aspiration || "N/A" },
      { label: "Displacement", get: (c) => (c.engine.displacementL ? c.engine.displacementL + "L" : "N/A") },
      { label: "Cylinders", get: (c) => (c.engine.cylinders != null ? c.engine.cylinders : "N/A") },
      { label: "Transmission", get: (c) => c.transmission.type || "N/A" },
      { label: "Gears", get: (c) => (c.transmission.gears != null ? c.transmission.gears : "N/A") },
      { label: "Drivetrain", get: (c) => c.transmission.drivetrain || "N/A" },
      { label: "Fuel Type", get: (c) => c.engine.fuelType || "N/A" },
      { label: "MSRP", get: (c) => fmtCurrency(c.pricing.msrpUsd) },
      { label: "Current Market Value", get: (c) => fmtCurrency(c.pricing.currentMarketValueUsd) },
    ];

    const headCells = cars.map((c) => `<th><p class="car-th-brand">${c.company}</p><p class="car-th-name">${c.model}</p></th>`).join("");
    const infoBody = infoRows
      .map((row) => `<tr><td class="muted">${row.label}</td>${cars.map((c) => `<td>${row.get(c)}</td>`).join("")}</tr>`)
      .join("");
    const perfBody = COMPARISON_METRICS.map((m) => {
      const winners = getWinnerIds(cars, m);
      return `<tr><td class="muted">${m.label} (${m.unit})</td>${cars
        .map((c) => {
          const isWinner = winners.has(c.id);
          return `<td class="${isWinner ? "compare-winner" : ""}">${fmtMetric(m.get(c), m.unit)}${isWinner ? '<span class="compare-winner-badge">BEST</span>' : ""}</td>`;
        })
        .join("")}</tr>`;
    }).join("");

    return `<div class="compare-table-wrap"><table class="compare-table">
      <thead><tr><th>Spec</th>${headCells}</tr></thead>
      <tbody>
        <tr class="compare-section-row"><td colspan="${cars.length + 1}">Overview</td></tr>
        ${infoBody}
        <tr class="compare-section-row"><td colspan="${cars.length + 1}">Performance</td></tr>
        ${perfBody}
      </tbody>
    </table></div>`;
  }

  function renderBars(cars) {
    function barGroup(title, getValue, format, lowerIsBetter) {
      const values = cars.map(getValue).filter((v) => v !== null && v !== undefined);
      if (values.length === 0) return "";
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const best = lowerIsBetter ? minVal : maxVal;
      const barMax = lowerIsBetter ? maxVal - minVal : maxVal;
      const rows = cars
        .map((c) => {
          const value = getValue(c);
          const score = value === null || value === undefined ? null : lowerIsBetter ? maxVal - value : value;
          const pct = score === null || barMax === 0 ? 0 : Math.min(100, Math.max(2, (score / barMax) * 100));
          const isBest = value === best;
          return `<div class="stat-bar">
            <div class="stat-bar-head"><span style="${isBest ? "color:var(--foreground);font-weight:600;" : ""}">${c.company} ${c.model}</span><span style="${isBest ? "color:var(--accent);font-weight:600;" : ""}">${format(value)}</span></div>
            <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
          </div>`;
        })
        .join("");
      return `<div class="compare-bar-group"><h3>${title}</h3>${rows}</div>`;
    }

    return `<div class="compare-bars-grid">
      ${barGroup("Horsepower", (c) => c.performance.horsepowerHp, (v) => fmt(v, "HP"), false)}
      ${barGroup("Torque", (c) => c.performance.torqueNm, (v) => fmt(v, "Nm"), false)}
      ${barGroup("Top Speed", (c) => c.performance.topSpeedKmh, (v) => fmt(v, "km/h"), false)}
      ${barGroup("0-100 km/h (lower is faster)", (c) => c.performance.zeroTo100Sec, (v) => fmtDecimal(v, "s"), true)}
    </div>`;
  }

  function renderRadar(cars) {
    const COLORS = ["#ff3355", "#00e0ff", "#ffb238", "#2fe38a"];
    const axes = getRadarAxes(cars[0], cars).map((a) => ({ key: a.key, label: a.label }));
    const cx = 150, cy = 150, radius = 110;
    const angleFor = (i) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    const pointFor = (i, value) => {
      const r = (value / 100) * radius;
      const a = angleFor(i);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };

    const gridRings = [20, 40, 60, 80, 100]
      .map((v) => {
        const pts = axes.map((_, i) => pointFor(i, v).join(",")).join(" ");
        return `<polygon points="${pts}" fill="none" stroke="var(--border-subtle)" stroke-width="1"/>`;
      })
      .join("");

    const spokes = axes
      .map((_, i) => {
        const [x, y] = pointFor(i, 100);
        return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--border-subtle)" stroke-width="1"/>`;
      })
      .join("");

    const labels = axes
      .map((axis, i) => {
        const [x, y] = pointFor(i, 122);
        return `<text x="${x}" y="${y}" fill="var(--muted)" font-size="10" text-anchor="middle" dominant-baseline="middle">${axis.label}</text>`;
      })
      .join("");

    const polygons = cars
      .map((car, ci) => {
        const carAxes = getRadarAxes(car, cars);
        const pts = carAxes.map((a, i) => pointFor(i, a.score).join(",")).join(" ");
        const color = COLORS[ci % COLORS.length];
        return `<polygon points="${pts}" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2"/>`;
      })
      .join("");

    const legend = cars
      .map((car, ci) => `<div class="radar-legend-item"><span class="radar-legend-swatch" style="background:${COLORS[ci % COLORS.length]}"></span>${car.company} ${car.model}</div>`)
      .join("");

    return `<div class="radar-panel">
      <h3>Performance Radar</h3>
      <p>Each axis is normalized 0-100 against the strongest car in this comparison. Handling is a proxy combining power-to-weight and acceleration — no lateral grip data exists in the dataset.</p>
      <svg viewBox="0 0 300 300" style="width:100%; max-width:420px; display:block; margin:0 auto;">${gridRings}${spokes}${polygons}${labels}</svg>
      <div class="radar-legend">${legend}</div>
    </div>`;
  }

  function renderAll() {
    const slugs = getUrlSlugs();
    const cars = slugs.map((s) => allCars.find((c) => c.slug === s)).filter(Boolean);
    renderSlots(cars, slugs);

    const contentEl = document.getElementById("compare-content");

    if (cars.length === 0) {
      contentEl.innerHTML = `<div class="empty-state">
        <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
        <h2>No cars selected</h2>
        <p>Search for a car above, or browse the catalog to start building a comparison.</p>
        <a href="/cars" class="btn btn-primary">Browse cars</a>
      </div>`;
      return;
    }
    if (cars.length === 1) {
      contentEl.innerHTML = `<p class="muted" style="text-align:center;padding:4rem 0;">Add at least one more car to see a comparison.</p>`;
      return;
    }

    contentEl.innerHTML = renderHeadToHead(cars) + renderTable(cars) + renderBars(cars) + renderRadar(cars);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    allCars = await window.RevCompareTray.getAllCarsCached();
    renderAll();
  });

  window.addEventListener("popstate", renderAll);
})();
