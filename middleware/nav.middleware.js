const NAV_KEYS = [
  ["users/create", "create-user"],
  ["users", "users"],
  ["profile", "profile"],
  ["categories", "categories"],
  ["languages", "languages"],
  ["snippets", "snippets"],
];

function navHandler(req, res, next) {
  const path = req.path.replace(/^\/+|\/+$/g, "");
  const match = NAV_KEYS.find(
    ([prefix]) => path === prefix || path.startsWith(`${prefix}/`)
  );
  res.locals.activeNav = match ? match[1] : "snippets";
  next();
}

module.exports = { navHandler };
