const query = require("../lib/query-handler");
const authService = require("./auth.service");

const create = async (username, email, password) => {
  const passwordHash = await authService.hashPassword(password);
  const apiKey = authService.generateApiKey();
  const sql = `
    INSERT INTO users (username, email, password_hash, api_key, is_admin, is_approved)
    VALUES (?, ?, ?, ?, 0, 0)
  `;
  return query.run(sql, [username, email, passwordHash, apiKey]);
};

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

const findByUsername = (username) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  return query.get(sql, [username]);
};

const findById = (id) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  return query.get(sql, [id]);
};

const findByApiKey = (apiKey) => {
  const sql =
    "SELECT id, username, is_admin FROM users WHERE api_key = ? AND is_approved = 1";
  return query.get(sql, [apiKey]);
};

const getApiKeyForUser = (userId) => {
  const sql = "SELECT api_key FROM users WHERE id = ?";
  return query.get(sql, [userId]);
};

const findAll = () => {
  const sql =
    "SELECT id, username, email, is_admin, is_approved, created_at FROM users ORDER BY created_at DESC";
  return query.all(sql);
};

const approveUser = (id, isApproved) => {
  const sql = "UPDATE users SET is_approved = ? WHERE id = ?";
  return query.run(sql, [isApproved, id]);
};

const updateEmail = async (userId, newEmail) => {
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

const updatePassword = async (userId, newPassword) => {
  const newPasswordHash = await authService.hashPassword(newPassword);
  const sql = "UPDATE users SET password_hash = ? WHERE id = ?";
  return query.run(sql, [newPasswordHash, userId]);
};

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
