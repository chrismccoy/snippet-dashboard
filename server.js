// Snippet App

require("dotenv").config();

const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");
const cookieParser = require("cookie-parser");

const { initializeDatabase } = require("./config/database");
const mainRouter = require("./routes");
const errorHandler = require("./middleware/error.middleware");
const { resolveListStyle } = require("./lib/list-style");
const { pageUrl } = require("./lib/page-param");
const { safeHref } = require("./lib/safe-url");

async function startServer() {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("FATAL: Failed to initialize database. Server is shutting down.");
    process.exit(1);
  }

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use(
    session({
      store: new SQLiteStore({ db: "sessions.db", dir: "./data" }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.urlStyle = process.env.URL_STYLE || "seo";
    res.locals.listStyle = resolveListStyle(process.env.LIST_STYLE);
    res.locals.pageUrl = pageUrl;
    res.locals.safeHref = safeHref;
    next();
  });

  app.use("/", mainRouter);

  app.use(errorHandler);

  app.listen(PORT, () => {
    const baseUrl = `http://localhost:${PORT}`;
    console.log("\n🚀 Server is up and running!");
    console.log(`🔗 Public site available at: \x1b[32m${baseUrl}/\x1b[0m`);
    console.log(
      `🔑 Admin login available at: \x1b[33m${baseUrl}/admin/login\x1b[0m\n`
    );
  });
}

startServer();
