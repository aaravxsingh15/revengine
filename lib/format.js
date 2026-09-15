"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fmt = fmt;
exports.fmtDecimal = fmtDecimal;
exports.fmtCurrency = fmtCurrency;
exports.fmtYearRange = fmtYearRange;
exports.cn = cn;
function fmt(value, unit = "") {
    if (value === null || value === undefined)
        return "N/A";
    return `${value.toLocaleString("en-US")}${unit ? ` ${unit}` : ""}`;
}
function fmtDecimal(value, unit = "", digits = 1) {
    if (value === null || value === undefined)
        return "N/A";
    return `${value.toFixed(digits)}${unit ? ` ${unit}` : ""}`;
}
function fmtCurrency(value) {
    if (value === null || value === undefined)
        return "N/A";
    if (value >= 1000000)
        return `$${(value / 1000000).toFixed(2)}M`;
    return `$${value.toLocaleString("en-US")}`;
}
function fmtYearRange(start, end) {
    if (start === null)
        return "N/A";
    if (end === null)
        return `${start} – Present`;
    if (start === end)
        return `${start}`;
    return `${start} – ${end}`;
}
function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
