/**
 * These routes are accessible to all users and are used for
 * viewing snippets, categories, tags, and search results. The `populateSidebarData`
 * middleware is applied to this entire router.
 */

const express = require("express");
const router = express.Router();
const publicController = require("../controllers/public.controller");

/**
 * Renders the home page with a paginated list of all snippets.
 */
router.get("/", publicController.renderIndexPage);

/**
 * Renders the search results page using an SEO-friendly URL.
 */
router.get("/search/:query", publicController.renderSearchPage);

/**
 * Handles old-style search URLs (`?q=...`) and permanently redirects
 */
router.get("/search", (req, res) => {
  const query = req.query.q;
  if (query && query.trim()) {
    return res.redirect(301, `/search/${encodeURIComponent(query.trim())}`);
  }
  res.redirect("/");
});

/**
 * Renders a paginated list of snippets belonging to a specific category.
 */
router.get("/category/:slug", publicController.renderCategoryPage);

/**
 * Renders a paginated list of snippets tagged with a specific tag.
 */
router.get("/tag/:tag", publicController.renderTagPage);

/**
 * Renders a paginated list of snippets for a specific language.
 */
router.get("/language/:slug", publicController.renderLanguagePage);

/**
 * Handles the request to download a snippet's source code as a file.
 */
router.get("/download/:identifier", publicController.downloadSnippet);

/**
 * Renders a paginated list of snippets by a specific author.
 */
router.get("/author/:username", publicController.renderAuthorPage);

/**
 * Handles old /snippet/... URLs and permanently redirects them
 */
router.get("/snippet/:identifier", (req, res) => {
  const { identifier } = req.params;
  res.redirect(301, `/${identifier}`);
});

/**
 * Renders the detailed view for a single snippet.
 * This is a catch-all route at the end, so it only runs if no other route matches.
 */
router.get("/:identifier", publicController.renderSnippetPage);

module.exports = router;
