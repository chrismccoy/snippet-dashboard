const express = require("express");
const router = express.Router();
const languageController = require("../controllers/language.controller");

router.get("/", languageController.getAllLanguages);

router.post("/add", languageController.createLanguage);

router.post("/update/:id", languageController.updateLanguage);

router.post("/delete/:id", languageController.deleteLanguage);

module.exports = router;
