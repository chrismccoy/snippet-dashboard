/**
 * Controller for frontend
 */

const asyncHandler = require("express-async-handler");
const snippetService = require("../services/snippet.service");
const categoryService = require("../services/category.service");
const languageService = require("../services/language.service");
const userService = require("../services/user.service");
const languageExtensionMap = require("../utils/language-map");

const ITEMS_PER_PAGE = parseInt(process.env.ITEMS_PER_PAGE, 10) || 5;

/**
 * Renders the home page with a paginated list of all snippets.
 */
const renderIndexPage = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const totalItems = await snippetService.countAll();
  const snippets = await snippetService.findPaginated(page, ITEMS_PER_PAGE);

  res.render("public/index", {
    title: "All Snippets",
    mainTitle: process.env.HOMEPAGE_TITLE,
    subtitle: process.env.HOMEPAGE_SUBTITLE,
    snippets,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
      baseUrl: "/",
    },
  });
});

/**
 * Renders a page showing snippets for a specific category.
 */
const renderCategoryPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const category = await categoryService.findBySlug(slug);

  if (!category) return res.status(404).send("Category not found");

  const totalItems = await snippetService.countByCategory(category.id);
  const snippets = await snippetService.findPaginatedByCategory(
    category.id,
    page,
    ITEMS_PER_PAGE
  );

  res.render("public/category", {
    title: `Category: ${category.name}`,
    categoryName: category.name,
    snippets,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
      baseUrl: `/category/${slug}`,
    },
  });
});

/**
 * Renders the detail page for a single snippet.
 */
const renderSnippetPage = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const snippet = await snippetService.findByIdentifierWithDetail(identifier);

  if (!snippet) return res.status(404).send("Snippet not found");

  res.render("public/snippet", {
    title: snippet.title,
    snippet,
  });
});

/**
 * Handles the download request for a snippet's source code.
 */
const downloadSnippet = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const snippet = await snippetService.findByIdentifierWithDetail(identifier);

  if (!snippet) {
    return res.status(404).send("Snippet not found");
  }

  const extension = languageExtensionMap[snippet.language_slug] || ".txt";
  const filename = `${snippet.slug}${extension}`;

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(snippet.code);
});

/**
 * Renders the search results page.
 */
const renderSearchPage = asyncHandler(async (req, res) => {
  const query = req.params.query || "";
  if (!query.trim()) {
    return res.redirect("/");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const totalItems = await snippetService.countSearchResults(query);
  const snippets = await snippetService.search(query, page, ITEMS_PER_PAGE);

  res.render("public/search", {
    title: `Search: "${query}"`,
    query: query,
    snippets,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
      baseUrl: `/search/${encodeURIComponent(query)}`,
    },
  });
});

/**
 * Renders a page showing snippets for a specific tag.
 */
const renderTagPage = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const totalItems = await snippetService.countByTag(tag);
  const snippets = await snippetService.findPaginatedByTag(
    tag,
    page,
    ITEMS_PER_PAGE
  );

  res.render("public/tag", {
    title: `Tagged: "${tag}"`,
    tag: tag,
    snippets,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
      baseUrl: `/tag/${encodeURIComponent(tag)}`,
    },
  });
});

/**
 * Renders a page showing snippets for a specific language.
 */
const renderLanguagePage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const language = await languageService.findBySlug(slug);

  if (!language) return res.status(404).send("Language not found");

  const totalItems = await snippetService.countByLanguage(language.id);
  const snippets = await snippetService.findPaginatedByLanguage(
    language.id,
    page,
    ITEMS_PER_PAGE
  );

  res.render("public/index", {
    title: `Language: ${language.name}`,
    mainTitle: "Language Archive",
    subtitle: `Showing all snippets for: <span class="bg-yellow-300 px-2 dark:text-black">'${language.name}'</span>`,
    snippets,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
      baseUrl: `/language/${slug}`,
    },
  });
});

/**
 * Renders a page showing all snippets created by a specific author.
 */
const renderAuthorPage = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const page = parseInt(req.query.page, 10) || 1;

  // First, check if the author actually exists to avoid showing an empty page for a typo.
  const author = await userService.findByUsername(username);
  if (!author) {
    return res.status(404).send("Author not found");
  }

  const totalItems = await snippetService.countByAuthor(username);
  const snippets = await snippetService.findPaginatedByAuthor(
    username,
    page,
    ITEMS_PER_PAGE
  );

  res.render("public/author", {
    title: `Snippets by ${author.username}`,
    authorName: author.username,
    snippets,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
      baseUrl: `/author/${username}`,
    },
  });
});

module.exports = {
  renderIndexPage,
  renderCategoryPage,
  renderSnippetPage,
  downloadSnippet,
  renderSearchPage,
  renderTagPage,
  renderLanguagePage,
  renderAuthorPage,
};
