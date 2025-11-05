/**
 * Middleware for populating sidebar data.
 */

const asyncHandler = require("express-async-handler");
const snippetService = require("../services/snippet.service");
const categoryService = require("../services/category.service");
const languageService = require("../services/language.service");

const populateSidebarData = asyncHandler(async (req, res, next) => {
  // Fetch all necessary data for the sidebar in parallel.
  const [recentSnippets, allCategories, allLanguages, allTags] =
    await Promise.all([
      snippetService.findRecent(5),
      categoryService.findAllWithCount(),
      languageService.findAllWithCount(),
      snippetService.findAllTags(),
    ]);

  res.locals.sidebar = {
    recentSnippets,
    allCategories,
    allLanguages,
    allTags,
  };

  next(); // Pass control to the next middleware or route handler.
});

module.exports = { populateSidebarData };
