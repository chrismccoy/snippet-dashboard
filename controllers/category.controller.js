/**
 * Controller for handling admin category management requests.
 */

const asyncHandler = require("express-async-handler");
const categoryService = require("../services/category.service");

/**
 * Renders the page to manage all categories.
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.findAll();
  res.render("admin/categories", {
    categories,
    title: "Manage Categories",
  });
});

/**
 * Handles the creation of a new category.
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (name && name.trim()) {
    await categoryService.create(name.trim());
  }
  res.redirect("/admin/categories");
});

/**
 * Handles the updating of an existing category.
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (name && name.trim() && id) {
    await categoryService.update(id, name.trim());
  }
  res.redirect("/admin/categories");
});

/**
 * Handles the deletion of a category.
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id) {
    await categoryService.remove(id);
  }
  res.redirect("/admin/categories");
});

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
