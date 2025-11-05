const asyncHandler = require("express-async-handler");
const userService = require("../services/user.service");

const renderUsersPage = asyncHandler(async (req, res) => {
  const users = await userService.findAll();
  res.render("admin/users", { title: "Manage Users", users });
});

const renderCreateUserForm = (req, res) => {
  res.render("admin/create-user", {
    title: "Create User",
    error: null,
    success: null,
  });
};

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
  res.redirect("/admin/users");
});

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
