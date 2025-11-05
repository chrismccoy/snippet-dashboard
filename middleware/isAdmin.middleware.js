/**
 * Admin authorization middleware.
 */

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.is_admin) {
    return next();
  }
  // User is logged in but not an admin, or not logged in at all.
  // Send a 'Forbidden' status or redirect.
  res.status(403).send("Forbidden: You do not have administrative privileges.");
}

module.exports = { isAdmin };
