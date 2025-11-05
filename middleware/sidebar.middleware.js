const asyncHandler = require("express-async-handler");
const snippetService = require("../services/snippet.service");
const categoryService = require("../services/category.service");
const languageService = require("../services/language.service");
const { positiveInt, boolish } = require("../lib/settings");

const RECENT_COUNT = positiveInt(process.env.RECENT_COUNT, 5, { max: 25 });

const SHOW_TAG_CLOUD = boolish(process.env.SHOW_TAG_CLOUD, true);
const SHOW_LANGUAGES = boolish(process.env.SHOW_LANGUAGES, true);

const populateSidebarData = asyncHandler(async (req, res, next) => {
  const [recentSnippets, allCategories, allLanguages, allTags] =
    await Promise.all([
      snippetService.findRecent(RECENT_COUNT),
      categoryService.findAllWithCount(),
      SHOW_LANGUAGES ? languageService.findAllWithCount() : [],
      SHOW_TAG_CLOUD ? snippetService.findAllTags() : [],
    ]);

  res.locals.sidebar = {
    recentSnippets,
    allCategories,
    allLanguages,
    allTags,
  };

  next();
});

module.exports = { populateSidebarData };
