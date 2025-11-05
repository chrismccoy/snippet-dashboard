const express = require("express");
const router = express.Router();
const snippetController = require("../controllers/snippet.controller");

router.get("/", snippetController.getAllSnippets);

router.get("/new", snippetController.getSnippetForm);

router.post("/add", snippetController.createSnippet);

router.get("/edit/:id", snippetController.getSnippetForm);

router.post("/update/:id", snippetController.updateSnippet);

router.post("/delete/:id", snippetController.deleteSnippet);

module.exports = router;
