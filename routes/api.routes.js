/**
 * Defines routes for the public API.
 */

const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api.controller");
const { isApiAuthenticated } = require("../middleware/isApiAuthenticated.middleware");

// Protect all routes in this file with the API authentication middleware.
router.use(isApiAuthenticated);

/**
 * Creates a new snippet for the authenticated user.
 */
router.post("/snippets", apiController.createSnippet);

/**
 * Lists snippets owned by the authenticated user. Supports pagination.
 */
router.get("/snippets", apiController.listUserSnippets);

/**
 * Looks up a category ID by its name or slug.
 */
router.get("/categories/lookup/:name", apiController.lookupCategory);

/**
 * Looks up a language ID by its name or slug.
 */
router.get("/languages/lookup/:name", apiController.lookupLanguage);

module.exports = router;
