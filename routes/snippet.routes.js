/**
 * Defines the admin routes for managing snippets.
 */

const express = require("express");
const router = express.Router();
const snippetController = require("../controllers/snippet.controller");

/**
 * Displays the main admin dashboard with a list of all snippets.
 */
router.get("/", snippetController.getAllSnippets);

/**
 * Renders the form for creating a new snippet.
 */
router.get("/new", snippetController.getSnippetForm);

/**
 * Creates a new snippet based on form data.
 */
router.post("/add", snippetController.createSnippet);

/**
 * Renders the form for editing an existing snippet, populated with its data.
 */
router.get("/edit/:id", snippetController.getSnippetForm);

/**
 * Updates an existing snippet identified by its ID.
 */
router.post("/update/:id", snippetController.updateSnippet);

/**
 * Deletes a snippet identified by its ID.
 */
router.post("/delete/:id", snippetController.deleteSnippet);

module.exports = router;
