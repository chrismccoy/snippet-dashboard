const bcrypt = require("bcrypt");
const crypto = require("crypto");

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateApiKey() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = {
  hashPassword,
  comparePassword,
  generateApiKey,
};
