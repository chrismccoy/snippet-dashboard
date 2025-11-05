/**
 * Controller for handling authentication
 */

const asyncHandler = require("express-async-handler");
const userService = require("../services/user.service");
const authService = require("../services/auth.service");

/**
 * Renders the login page for dashboard access.
 */
const renderLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/admin");
  }
  res.render("admin/login", { error: null });
};

/**
 * Renders the public signup page for new users.
 */
const renderSignupPage = (req, res) => {
  res.render("signup", { error: null, success: null });
};

/**
 * Handles the submission of a new user registration form.
 */
const handleSignup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .render("signup", { error: "All fields are required.", success: null });
  }
  const existingUser = await userService.findByUsername(username);
  if (existingUser) {
    return res
      .status(409)
      .render("signup", { error: "Username already exists.", success: null });
  }
  await userService.create(username, email, password);
  res.render("signup", {
    error: null,
    success: "Account created! Please wait for admin approval.",
  });
});

/**
 * Handles user login attempts.
 */
const handleLogin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await userService.findByUsername(username);

  // Check if user exists and password matches
  if (
    !user ||
    !(await authService.comparePassword(password, user.password_hash))
  ) {
    return res
      .status(401)
      .render("admin/login", { error: "Invalid username or password" });
  }

  // Check if the user's account has been approved by an admin
  if (!user.is_approved) {
    return res
      .status(403)
      .render("admin/login", { error: "Your account has not been approved yet." });
  }

  // Regenerate session
  req.session.regenerate((err) => {
    if (err) return next(err);

    // Store essential, non-sensitive user info in the session
    req.session.user = {
      id: user.id,
      username: user.username,
      is_admin: !!user.is_admin,
    };

    res.redirect("/admin");
  });
});

/**
 * Handles user logout.
 */
const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session during logout.", err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/admin/login");
  });
};

/**
 * Renders the current user's profile page.
 */
const renderProfilePage = asyncHandler(async (req, res) => {
  // Fetch API key
  const apiKeyResult = await userService.getApiKeyForUser(req.session.user.id);
  // Fetch full user object for current email
  const user = await userService.findById(req.session.user.id);

  res.render("admin/profile", {
    title: "My Profile",
    apiKey: apiKeyResult ? apiKeyResult.api_key : "API Key not found.",
    userEmail: user ? user.email : "N/A",
    error: null,
    success: req.query.success || null,
  });
});

/**
 * Renders the form for a user to edit their profile (email and password).
 */
const renderProfileEditForm = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.session.user.id);
  if (!user) {
    return res.status(404).send("User not found.");
  }
  res.render("admin/profile-edit", {
    title: "Edit Profile",
    email: user.email,
    error: null,
    success: null,
  });
});

/**
 * Handles the submission to update the user's email address.
 */
const handleUpdateEmail = asyncHandler(async (req, res) => {
  const { newEmail, currentPassword } = req.body;
  const userId = req.session.user.id;
  const user = await userService.findById(userId);

  // Security check: Verify current password
  if (!user || !(await authService.comparePassword(currentPassword, user.password_hash))) {
    return res.render("admin/profile-edit", {
      title: "Edit Profile",
      email: user ? user.email : "",
      error: "Incorrect current password.",
      success: null,
    });
  }
  // Validate new email
  if (!newEmail || newEmail.trim() === "") {
    return res.render("admin/profile-edit", {
      title: "Edit Profile",
      email: user.email,
      error: "Please provide a new email address.",
      success: null,
    });
  }
  if (newEmail.trim() === user.email) {
    return res.render("admin/profile-edit", {
      title: "Edit Profile",
      email: user.email,
      error: "New email address is the same as the current one.",
      success: null,
    });
  }

  try {
    await userService.updateEmail(userId, newEmail.trim());
    res.render("admin/profile-edit", {
      title: "Edit Profile",
      email: newEmail.trim(),
      error: null,
      success: "Email updated successfully!",
    });
  } catch (error) {
    if (error.message === "Email already taken by another user.") {
      return res.render("admin/profile-edit", {
        title: "Edit Profile",
        email: user.email,
        error: error.message,
        success: null,
      });
    }
    throw error;
  }
});

/**
 * Handles the submission to update the user's password.
 */
const handleUpdatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.session.user.id;
  const user = await userService.findById(userId);

  // Security check: Verify current password
  if (!user || !(await authService.comparePassword(currentPassword, user.password_hash))) {
    return res.render("admin/profile-edit", {
      title: "Edit Profile",
      email: user ? user.email : "",
      error: "Incorrect current password.",
      success: null,
    });
  }
  // Validate new password
  if (!newPassword || newPassword.length < 6) {
    return res.render("admin/profile-edit", {
      title: "Edit Profile",
      email: user.email,
      error: "New password must be at least 6 characters.",
      success: null,
    });
  }
  if (newPassword !== confirmNewPassword) {
    return res.render("admin/profile-edit", {
      title: "Edit Profile",
      email: user.email,
      error: "New passwords do not match.",
      success: null,
    });
  }
  if (await authService.comparePassword(newPassword, user.password_hash)) {
    return res.render('admin/profile-edit', {
      title: 'Edit Profile',
      email: user.email,
      error: 'New password cannot be the same as the current password.',
      success: null
    });
  }

  await userService.updatePassword(userId, newPassword);
  // On success, re-render the edit form with a success message
  res.render("admin/profile-edit", {
    title: "Edit Profile",
    email: user.email,
    error: null,
    success: "Password updated successfully!",
  });
});

/**
 * Handles the request to regenerate a user's API key.
 */
const handleRegenerateApiKey = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await userService.regenerateApiKey(userId);
  // Redirect back to the profile page with a success message in the query string
  res.redirect("/admin/profile?success=API key regenerated successfully!");
});


module.exports = {
  renderLoginPage,
  renderSignupPage,
  handleSignup,
  handleLogin,
  handleLogout,
  renderProfilePage,
  renderProfileEditForm,
  handleUpdateEmail,
  handleUpdatePassword,
  handleRegenerateApiKey,
};
