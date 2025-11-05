/**
 * API authentication middleware.
 */

const asyncHandler = require("express-async-handler");
const userService = require("../services/user.service");

const isApiAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }

  const user = await userService.findByApiKey(token);

  if (!user) {
    return res.status(401).json({ message: "Not authorized, token is invalid." });
  }

  // Attach the authenticated user's info to the request object
  req.user = user;
  next();
});

module.exports = { isApiAuthenticated };
