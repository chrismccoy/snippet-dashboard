const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.renderUsersPage);

router.get("/create", userController.renderCreateUserForm);

router.post("/create", userController.handleCreateUser);

router.post("/approve/:id", userController.approveUser);

module.exports = router;
