/**
 * Defines the admin routes for managing languages.
 */

const express = require("express");
const router = express.Router();
const languageController = require("../controllers/language.controller");

/**
 * Displays the main language management page with a list of all languages.
 */
router.get("/", languageController.getAllLanguages);

/**
 * Creates a new language based on form data.
 */
router.post("/add", languageController.createLanguage);

/**
 * Updates an existing language identified by its ID.
 */
router.post("/update/:id", languageController.updateLanguage);

/**
 * Deletes a language identified by its ID.
 */
router.post("/delete/:id", languageController.deleteLanguage);

module.exports = router;
