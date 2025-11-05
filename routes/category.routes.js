/**
 * Defines the admin routes for managing categories.
 */

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

/**
 * Displays the main category management page with a list of all categories.
 */
router.get("/", categoryController.getAllCategories);

/**
 * Creates a new category based on form data.
 */
router.post("/add", categoryController.createCategory);

/**
 * Updates an existing category identified by its ID.
 */
router.post("/update/:id", categoryController.updateCategory);

/**
 * Deletes a category identified by its ID.
 */
router.post("/delete/:id", categoryController.deleteCategory);

module.exports = router;
