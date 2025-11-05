/**
 * Master router
 */

const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middleware/auth.middleware");
const { populateSidebarData } = require("../middleware/sidebar.middleware");
const { isAdmin } = require("../middleware/isAdmin.middleware");

const publicRoutes = require("./public.routes");
const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const snippetRoutes = require("./snippet.routes");
const languageRoutes = require("./language.routes");
const apiRoutes = require("./api.routes");
const userRoutes = require("./user.routes");
const authController = require("../controllers/auth.controller");

// api routes
router.use("/api/v1", apiRoutes);

// authentication (login/logout).
router.use("/admin", authRoutes);

// protected admin content area.
const protectedAdminArea = express.Router();
protectedAdminArea.get("/", (req, res) => res.redirect("/admin/snippets"));
protectedAdminArea.get("/profile", authController.renderProfilePage);

protectedAdminArea.get("/profile/edit", authController.renderProfileEditForm);
protectedAdminArea.post("/profile/update-email", authController.handleUpdateEmail);
protectedAdminArea.post("/profile/update-password", authController.handleUpdatePassword);
protectedAdminArea.post("/profile/regenerate-api-key", authController.handleRegenerateApiKey);

protectedAdminArea.use("/snippets", snippetRoutes);
protectedAdminArea.use("/categories", isAdmin, categoryRoutes);
protectedAdminArea.use("/languages", isAdmin, languageRoutes);
protectedAdminArea.use("/users", isAdmin, userRoutes);

// isAuthenticated middleware to the entire protected area.
router.use("/admin", isAuthenticated, protectedAdminArea);

// public
router.get("/signup", authController.renderSignupPage);
router.post("/signup", authController.handleSignup);
router.get("/login", (req, res) => res.redirect("/admin/login")); // Convenience redirect

router.use("/", populateSidebarData, publicRoutes);

module.exports = router;
