/**
 * Defines routes related to user authentication (login, logout).
 */

const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const loginLimiter = rateLimit({
  windowMs:
    (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 10,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Renders the admin login page.
 */
router.get("/login", authController.renderLoginPage);

/**
 * Handles the admin login form submission.
 */
router.post("/login", loginLimiter, authController.handleLogin);

/**
 * Logs the admin user out and destroys the session.
 */
router.get("/logout", authController.handleLogout);

module.exports = router;
