// Client-side twin of lib/format.js's number formatting for use in
// browser-rendered markup (search results, browse grid re-renders, etc).
(function (global) {
  function fmt(value, unit) {
    if (value === null || value === undefined) return "N/A";
    return `${value.toLocaleString("en-US")}${unit ? " " + unit : ""}`;
  }
  function fmtDecimal(value, unit, digits) {
    if (value === null || value === undefined) return "N/A";
    return `${value.toFixed(digits === undefined ? 1 : digits)}${unit ? " " + unit : ""}`;
  }
  function fmtCurrency(value) {
    if (value === null || value === undefined) return "N/A";
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    return `$${value.toLocaleString("en-US")}`;
  }
  function fmtYearRange(start, end) {
    if (start === null || start === undefined) return "N/A";
    if (end === null || end === undefined) return `${start} – Present`;
    if (start === end) return `${start}`;
    return `${start} – ${end}`;
  }
  function powerToWeight(car) {
    const hp = car.performance.horsepowerHp;
    const kg = car.performance.weightKg;
    if (hp === null || kg === null || kg === 0) return null;
    return Math.round((hp / (kg / 1000)) * 10) / 10;
  }
  global.RevFormat = { fmt, fmtDecimal, fmtCurrency, fmtYearRange, powerToWeight };
})(window);
