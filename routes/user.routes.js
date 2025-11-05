/**
 * Defines admin routes for user management.
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Renders the list of all users
router.get("/", userController.renderUsersPage);

// Renders the form to create a new user
router.get("/create", userController.renderCreateUserForm);

// Handles the form submission for creating a new user
router.post("/create", userController.handleCreateUser);

// Handles approving or revoking access
router.post("/approve/:id", userController.approveUser);

module.exports = router;
