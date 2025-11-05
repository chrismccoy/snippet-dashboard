/**
 * Controller for handling admin language management requests.
 */

const asyncHandler = require("express-async-handler");
const languageService = require("../services/language.service");

/**
 * Renders the page to manage all languages.
 */
const getAllLanguages = asyncHandler(async (req, res) => {
  const languages = await languageService.findAll();
  res.render("admin/languages", {
    languages,
    title: "Manage Languages",
  });
});

/**
 * Handles the creation of a new language.
 */
const createLanguage = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (name && name.trim()) {
    await languageService.create(name.trim());
  }
  res.redirect("/admin/languages");
});

/**
 * Handles the updating of an existing language.
 */
const updateLanguage = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (name && name.trim() && id) {
    await languageService.update(id, name.trim());
  }
  res.redirect("/admin/languages");
});

/**
 * Handles the deletion of a language.
 */
const deleteLanguage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id) {
    await languageService.remove(id);
  }
  res.redirect("/admin/languages");
});

module.exports = {
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
