const express = require("express");
const router = express.Router();
const publicController = require("../controllers/public.controller");
const { isValidPageSegment, pageUrl } = require("../lib/page-param");

const requirePageSegment = (req, res, next) => {
  if (!isValidPageSegment(req.params.page)) {
    return res.status(404).send("Page not found");
  }
  if (req.params.page === "1") {
    return res.redirect(301, req.originalUrl.replace(/\/page\/1(?=$|\?)/, "") || "/");
  }
  next();
};

const redirectQueryPage = (req, res, next) => {
  if (req.query.page === undefined) return next();
  const rest = { ...req.query };
  delete rest.page;
  const qs = new URLSearchParams(rest).toString();
  const n = parseInt(req.query.page, 10);
  const target = pageUrl(req.path, Number.isFinite(n) ? n : 1) + (qs ? `?${qs}` : "");
  return res.redirect(301, target);
};

router.use(redirectQueryPage);

router.get("/", publicController.renderIndexPage);
router.get("/page/:page", requirePageSegment, publicController.renderIndexPage);

router.get("/search/:query", publicController.renderSearchPage);
router.get("/search/:query/page/:page", requirePageSegment, publicController.renderSearchPage);

router.get("/search", (req, res) => {
  const query = req.query.q;
  if (query && query.trim()) {
    return res.redirect(301, `/search/${encodeURIComponent(query.trim())}`);
  }
  res.redirect("/");
});

router.get("/category/:slug", publicController.renderCategoryPage);
router.get("/category/:slug/page/:page", requirePageSegment, publicController.renderCategoryPage);

router.get("/tag/:tag", publicController.renderTagPage);
router.get("/tag/:tag/page/:page", requirePageSegment, publicController.renderTagPage);

router.get("/language/:slug", publicController.renderLanguagePage);
router.get("/language/:slug/page/:page", requirePageSegment, publicController.renderLanguagePage);

router.get("/download/:identifier", publicController.downloadSnippet);

router.get("/author/:username", publicController.renderAuthorPage);
router.get("/author/:username/page/:page", requirePageSegment, publicController.renderAuthorPage);

router.get("/snippet/:identifier", (req, res) => {
  const { identifier } = req.params;
  res.redirect(301, `/${identifier}`);
});

router.get("/:identifier", publicController.renderSnippetPage);

module.exports = router;
