const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function safeHref(value) {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  return ALLOWED_PROTOCOLS.has(parsed.protocol) ? parsed.href : null;
}

module.exports = { safeHref, ALLOWED_PROTOCOLS };
