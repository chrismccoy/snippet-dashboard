/**
 * Authentication middleware.
 */

/**
 * Middleware to check if a user is authenticated.
 * If authenticated, it passes the request to the next middleware.
 * If not, it redirects the user to the login page.
 */
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/admin/login");
}

module.exports = { isAuthenticated };
