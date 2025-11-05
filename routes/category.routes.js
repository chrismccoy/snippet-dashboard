const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.get("/", categoryController.getAllCategories);

router.post("/add", categoryController.createCategory);

router.post("/update/:id", categoryController.updateCategory);

router.post("/delete/:id", categoryController.deleteCategory);

module.exports = router;
