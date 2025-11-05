const LIST_STYLES = new Set(["cards", "rows"]);
const DEFAULT_LIST_STYLE = "cards";

function resolveListStyle(value) {
  const normalised = String(value ?? "")
    .trim()
    .toLowerCase();
  return LIST_STYLES.has(normalised) ? normalised : DEFAULT_LIST_STYLE;
}

module.exports = { resolveListStyle, LIST_STYLES, DEFAULT_LIST_STYLE };
