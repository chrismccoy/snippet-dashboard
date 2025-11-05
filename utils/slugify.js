/**
 * Slug utility.
 */

/**
 * Converts a string into a URL-safe slug.
 */
function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

module.exports = slugify;
