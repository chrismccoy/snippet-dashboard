/**
 * Service for user database operations.
 */

const query = require("../lib/query-handler");
const authService = require("./auth.service");

/**
 * Creates a new user from the public signup form.
 */
const create = async (username, email, password) => {
  const passwordHash = await authService.hashPassword(password);
  const apiKey = authService.generateApiKey();
  const sql = `
    INSERT INTO users (username, email, password_hash, api_key, is_admin, is_approved)
    VALUES (?, ?, ?, ?, 0, 0)
  `;
  return query.run(sql, [username, email, passwordHash, apiKey]);
};

/**
 * Creates a new user from the admin dashboard.
 */
const createByAdmin = async (userData) => {
  const { username, email, password, is_admin } = userData;
  const passwordHash = await authService.hashPassword(password);
  const apiKey = authService.generateApiKey();
  const isAdminFlag = is_admin === "true" ? 1 : 0;
  const sql = `
    INSERT INTO users (username, email, password_hash, api_key, is_admin, is_approved)
    VALUES (?, ?, ?, ?, ?, 1)
  `;
  return query.run(sql, [username, email, passwordHash, apiKey, isAdminFlag]);
};

/**
 * Finds a single user by their username.
 */
const findByUsername = (username) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  return query.get(sql, [username]);
};

/**
 * Finds a single user by their ID.
 */
const findById = (id) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  return query.get(sql, [id]);
};

/**
 * Finds an approved user by their API key.
 */
const findByApiKey = (apiKey) => {
  const sql =
    "SELECT id, username, is_admin FROM users WHERE api_key = ? AND is_approved = 1";
  return query.get(sql, [apiKey]);
};

/**
 * Retrieves the API key for a given user ID.
 */
const getApiKeyForUser = (userId) => {
  const sql = "SELECT api_key FROM users WHERE id = ?";
  return query.get(sql, [userId]);
};

/**
 * Retrieves a list of all users for the admin management page.
 */
const findAll = () => {
  const sql =
    "SELECT id, username, email, is_admin, is_approved, created_at FROM users ORDER BY created_at DESC";
  return query.all(sql);
};

/**
 * Updates a user's approval status.
 */
const approveUser = (id, isApproved) => {
  const sql = "UPDATE users SET is_approved = ? WHERE id = ?";
  return query.run(sql, [isApproved, id]);
};

/**
 * Updates a user's email address.
 */
const updateEmail = async (userId, newEmail) => {
  // Check if the new email is already in use by another user
  const existingUserWithEmail = await query.get(
    "SELECT id FROM users WHERE email = ? AND id != ?",
    [newEmail, userId]
  );
  if (existingUserWithEmail) {
    throw new Error("Email already taken by another user.");
  }

  const sql = "UPDATE users SET email = ? WHERE id = ?";
  return query.run(sql, [newEmail, userId]);
};

/**
 * Updates a user's password.
 */
const updatePassword = async (userId, newPassword) => {
  const newPasswordHash = await authService.hashPassword(newPassword);
  const sql = "UPDATE users SET password_hash = ? WHERE id = ?";
  return query.run(sql, [newPasswordHash, userId]);
};

/**
 * Generates a new API key for a specific user and updates it in the database.
 */
const regenerateApiKey = async (userId) => {
  const newApiKey = authService.generateApiKey();
  const sql = "UPDATE users SET api_key = ? WHERE id = ?";
  await query.run(sql, [newApiKey, userId]);
  return newApiKey;
};

module.exports = {
  create,
  createByAdmin,
  findByUsername,
  findById,
  findByApiKey,
  getApiKeyForUser,
  findAll,
  approveUser,
  updateEmail,
  updatePassword,
  regenerateApiKey,
};
