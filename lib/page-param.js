function resolvePage(req) {
  const raw = req?.params?.page ?? req?.query?.page;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function isValidPageSegment(value) {
  return typeof value === "string" && /^[1-9][0-9]*$/.test(value);
}

function pageUrl(baseUrl, n) {
  const base = String(baseUrl).replace(/\/+$/, "");
  if (n <= 1) return base || "/";
  return `${base}/page/${n}`;
}

function clampPage(page, totalPages) {
  const last = Math.max(totalPages, 1);
  return page > last ? last : null;
}

module.exports = { resolvePage, isValidPageSegment, pageUrl, clampPage };
