/**
 * Controller for handling user management
 */

const asyncHandler = require("express-async-handler");
const userService = require("../services/user.service");

/**
 * Renders the user management page.
 */
const renderUsersPage = asyncHandler(async (req, res) => {
  const users = await userService.findAll();
  res.render("admin/users", { title: "Manage Users", users });
});

/**
 * Renders the form for an admin to create a new user.
 */
const renderCreateUserForm = (req, res) => {
  res.render("admin/create-user", {
    title: "Create User",
    error: null,
    success: null,
  });
};

/**
 * Handles the form submission for creating a new user by an admin.
 */
const handleCreateUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).render("admin/create-user", {
      title: "Create User",
      error: "All fields are required.",
      success: null,
    });
  }
  const existingUser = await userService.findByUsername(username);
  if (existingUser) {
    return res.status(409).render("admin/create-user", {
      title: "Create User",
      error: "Username already exists.",
      success: null,
    });
  }

  await userService.createByAdmin(req.body);
  // Redirect to the user list with a success message (optional, could use flash messages)
  res.redirect("/admin/users");
});

/**
 * Handles approving or revoking a user's access.
 */
const approveUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_approved } = req.body;
  await userService.approveUser(id, is_approved);
  res.redirect("/admin/users");
});

module.exports = {
  renderUsersPage,
  renderCreateUserForm,
  handleCreateUser,
  approveUser,
};
