function positiveInt(value, fallback, { max = 100 } = {}) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, max);
}

const TRUE = new Set(["1", "true", "yes", "on"]);
const FALSE = new Set(["0", "false", "no", "off"]);

function boolish(value, fallback) {
  const v = String(value ?? "").trim().toLowerCase();
  if (TRUE.has(v)) return true;
  if (FALSE.has(v)) return false;
  return fallback;
}

module.exports = { positiveInt, boolish };
