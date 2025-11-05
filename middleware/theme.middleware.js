/**
 * Middleware for handling the theme.
 */

function themeHandler(req, res, next) {
  // Read the cookie named 'theme'. Default to 'light' if not present.
  const theme = req.cookies.theme || "light";

  res.locals.theme = theme;

  next();
}

module.exports = { themeHandler };
