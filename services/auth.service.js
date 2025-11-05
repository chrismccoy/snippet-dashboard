/**
 * Service for authentication
 */

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain-text password with a hash.
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a cryptographically secure random string to be used as an API key.
 */
function generateApiKey() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = {
  hashPassword,
  comparePassword,
  generateApiKey,
};
