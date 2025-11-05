const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api.controller");
const { isApiAuthenticated } = require("../middleware/isApiAuthenticated.middleware");

router.use(isApiAuthenticated);

router.post("/snippets", apiController.createSnippet);

router.get("/snippets", apiController.listUserSnippets);

router.get("/categories/lookup/:name", apiController.lookupCategory);

router.get("/languages/lookup/:name", apiController.lookupLanguage);

module.exports = router;
