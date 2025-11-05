const asyncHandler = require("express-async-handler");
const snippetService = require("../services/snippet.service");
const categoryService = require("../services/category.service");
const languageService = require("../services/language.service");
const userService = require("../services/user.service");
const languageExtensionMap = require("../utils/language-map");
const { resolvePage, clampPage, pageUrl } = require("../lib/page-param");

const { positiveInt } = require("../lib/settings");

const ITEMS_PER_PAGE = positiveInt(process.env.ITEMS_PER_PAGE, 5);
const RELATED_COUNT = positiveInt(process.env.RELATED_COUNT, 5, { max: 25 });
const RANDOM_COUNT = positiveInt(process.env.RANDOM_COUNT, 5, { max: 25 });

const renderIndexPage = asyncHandler(async (req, res) => {
  const page = resolvePage(req);
  const totalItems = await snippetService.countAll();
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const baseUrl = "/";
  const beyond = clampPage(page, totalPages);
  if (beyond !== null) return res.redirect(302, pageUrl(baseUrl, beyond));
  const snippets = await snippetService.findPaginated(page, ITEMS_PER_PAGE);

  res.render("public/index", {
    title: "All Snippets",
    mainTitle: process.env.HOMEPAGE_TITLE,
    subtitle: process.env.HOMEPAGE_SUBTITLE,
    snippets,
    pagination: {
      currentPage: page,
      totalPages,
      baseUrl,
    },
  });
});

const renderCategoryPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = resolvePage(req);
  const category = await categoryService.findBySlug(slug);

  if (!category) return res.status(404).send("Category not found");

  const totalItems = await snippetService.countByCategory(category.id);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const baseUrl = `/category/${slug}`;
  const beyond = clampPage(page, totalPages);
  if (beyond !== null) return res.redirect(302, pageUrl(baseUrl, beyond));
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
      totalPages,
      baseUrl,
    },
  });
});

const renderSnippetPage = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const snippet = await snippetService.findByIdentifierWithDetail(identifier);

  if (!snippet) return res.status(404).send("Snippet not found");

  const related = await snippetService.findRelated(
    snippet.id,
    snippet.category_id ?? null,
    RELATED_COUNT
  );
  const random = await snippetService.findRandomOthers(
    snippet.id,
    RANDOM_COUNT,
    related.map((r) => r.id)
  );

  res.render("public/snippet", {
    title: snippet.title,
    snippet,
    related,
    random,
  });
});

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
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.send(snippet.code);
});

const renderSearchPage = asyncHandler(async (req, res) => {
  const query = req.params.query || "";
  if (!query.trim()) {
    return res.redirect("/");
  }

  const page = resolvePage(req);
  const totalItems = await snippetService.countSearchResults(query);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const baseUrl = `/search/${encodeURIComponent(query)}`;
  const beyond = clampPage(page, totalPages);
  if (beyond !== null) return res.redirect(302, pageUrl(baseUrl, beyond));
  const snippets = await snippetService.search(query, page, ITEMS_PER_PAGE);

  res.render("public/search", {
    title: `Search: "${query}"`,
    query: query,
    snippets,
    pagination: {
      currentPage: page,
      totalPages,
      baseUrl,
    },
  });
});

const renderTagPage = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  const page = resolvePage(req);
  const totalItems = await snippetService.countByTag(tag);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const baseUrl = `/tag/${encodeURIComponent(tag)}`;
  const beyond = clampPage(page, totalPages);
  if (beyond !== null) return res.redirect(302, pageUrl(baseUrl, beyond));
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
      totalPages,
      baseUrl,
    },
  });
});

const renderLanguagePage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = resolvePage(req);
  const language = await languageService.findBySlug(slug);

  if (!language) return res.status(404).send("Language not found");

  const totalItems = await snippetService.countByLanguage(language.id);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const baseUrl = `/language/${slug}`;
  const beyond = clampPage(page, totalPages);
  if (beyond !== null) return res.redirect(302, pageUrl(baseUrl, beyond));
  const snippets = await snippetService.findPaginatedByLanguage(
    language.id,
    page,
    ITEMS_PER_PAGE
  );

  res.render("public/language", {
    title: `Language: ${language.name}`,
    languageName: language.name,
    snippets,
    pagination: {
      currentPage: page,
      totalPages,
      baseUrl,
    },
  });
});

const renderAuthorPage = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const page = resolvePage(req);

  const author = await userService.findByUsername(username);
  if (!author) {
    return res.status(404).send("Author not found");
  }

  const totalItems = await snippetService.countByAuthor(username);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const baseUrl = `/author/${username}`;
  const beyond = clampPage(page, totalPages);
  if (beyond !== null) return res.redirect(302, pageUrl(baseUrl, beyond));
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
      totalPages,
      baseUrl,
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
