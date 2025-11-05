/**
 * Controller for handling admin snippet management requests.
 */

const asyncHandler = require("express-async-handler");
const snippetService = require("../services/snippet.service");
const categoryService = require("../services/category.service");
const languageService = require("../services/language.service");

/**
 * Renders the admin dashboard with a list of snippets.
 */
const getAllSnippets = asyncHandler(async (req, res) => {
  const user = req.session.user;
  let snippets;

  if (user.is_admin) {
    snippets = await snippetService.findAllForAdmin();
  } else {
    snippets = await snippetService.findAllForUser(user.id);
  }
  res.render("admin/index", {
    snippets,
    title: user.is_admin ? "All Snippets" : "My Snippets",
  });
});

/**
 * Renders the form to create or edit a snippet.
 */
const getSnippetForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [categories, languages] = await Promise.all([
    categoryService.findAll(),
    languageService.findAll(),
  ]);

  if (id) {
    const snippet = await snippetService.findById(id);
    if (!snippet) {
      return res.status(404).send("Snippet not found");
    }
    if (!req.session.user.is_admin && snippet.user_id !== req.session.user.id) {
      return res.status(403).send("Forbidden: You can only edit your own snippets.");
    }
    res.render("admin/snippet-form", {
      snippet,
      categories,
      languages,
      action: `/admin/snippets/update/${snippet.id}`,
      title: "Edit Snippet",
    });
  } else {
    res.render("admin/snippet-form", {
      snippet: {},
      categories,
      languages,
      action: "/admin/snippets/add",
      title: "Create New Snippet",
    });
  }
});

/**
 * Handles creation of a new snippet, associating it with the logged-in user
 */
const createSnippet = asyncHandler(async (req, res) => {
  const snippetData = {
    ...req.body,
    user_id: req.session.user.id,
    is_private: req.body.is_private === '1' ? 1 : 0,
  };
  await snippetService.create(snippetData);
  res.redirect("/admin/snippets");
});

/**
 * Handles updating an existing snippet, including its privacy status.
 */
const updateSnippet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const snippetData = {
    ...req.body,
    is_private: req.body.is_private === '1' ? 1 : 0,
  };
  await snippetService.update(id, req.session.user, snippetData);
  res.redirect("/admin/snippets");
});

/**
 * Handles deleting a snippet.
 */
const deleteSnippet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await snippetService.remove(id, req.session.user);
  res.redirect("/admin/snippets");
});

module.exports = {
  getAllSnippets,
  getSnippetForm,
  createSnippet,
  updateSnippet,
  deleteSnippet,
};
