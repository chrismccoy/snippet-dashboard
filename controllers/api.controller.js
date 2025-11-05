/**
 * Controller for handling API requests.
 */

const asyncHandler = require("express-async-handler");
const snippetService = require("../services/snippet.service");
const categoryService = require("../services/category.service");
const languageService = require("../services/language.service");
const slugify = require("../utils/slugify");

/**
 * Default items per page for API listings, if not specified by client.
 */
const DEFAULT_API_ITEMS_PER_PAGE = 10;

/**
 * Creates a new snippet via the API.
 */
const createSnippet = asyncHandler(async (req, res) => {
  const { title, description, code, tags, category_id, language_id, reference_url } = req.body;

  // Basic validation for required fields
  if (!title || !code) {
    return res.status(400).json({ message: "Title and code are required." });
  }

  // The authenticated user's ID is attached to req.user by the API authentication middleware.
  const userId = req.user.id;

  // Prepare snippet data, including the user_id for ownership
  const snippetData = {
    title,
    description,
    code,
    tags,
    category_id,
    language_id,
    reference_url,
    user_id: userId,
  };

  const newSnippet = await snippetService.create(snippetData);
  res.status(201).json({ message: "Snippet created successfully", snippetId: newSnippet.lastID });
});

/**
 * Lists snippets owned by the authenticated API user.
 */
const listUserSnippets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_API_ITEMS_PER_PAGE;

  const totalItems = await snippetService.countForUser(userId);
  const snippets = await snippetService.findPaginatedForUser(userId, page, limit);

  res.json({
    data: snippets,
    meta: {
      totalItems,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    },
  });
});


/**
 * Looks up a category by its name or slug and returns its ID and details.
 */
const lookupCategory = asyncHandler(async (req, res) => {
  const identifier = req.params.name;
  let category;

  // Attempt to find by exact name first.
  category = await categoryService.findByName(identifier);

  if (!category) {
    const slug = slugify(identifier);
    category = await categoryService.findBySlug(slug);
  }

  if (category) {
    res.json({ id: category.id, name: category.name, slug: category.slug });
  } else {
    res.status(404).json({ message: "Category not found." });
  }
});

/**
 * Looks up a language by its name or slug and returns its ID and details.
 */
const lookupLanguage = asyncHandler(async (req, res) => {
  const identifier = req.params.name;
  let language;

  // Attempt to find by exact name first.
  language = await languageService.findByName(identifier);

  if (!language) {
    const slug = slugify(identifier);
    language = await languageService.findBySlug(slug);
  }

  if (language) {
    res.json({ id: language.id, name: language.name, slug: language.slug });
  } else {
    res.status(404).json({ message: "Language not found." });
  }
});

module.exports = {
  createSnippet,
  listUserSnippets,
  lookupCategory,
  lookupLanguage,
};
