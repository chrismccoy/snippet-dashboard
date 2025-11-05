/**
 * Snippet Dashboard application.
 */

// Load environment variables from the .env file
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");
const cookieParser = require("cookie-parser");

const { initializeDatabase } = require("./config/database");
const mainRouter = require("./routes");
const errorHandler = require("./middleware/error.middleware");
const { themeHandler } = require("./middleware/theme.middleware");

/**
 * Application startup
 */
async function startServer() {
  // Wait for the completion of all database setup tasks.
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

  // Session Management
  app.use(
    session({
      store: new SQLiteStore({ db: "sessions.db", dir: "./data" }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      },
    })
  );

  // Custom middleware to make global variables available
  app.use(themeHandler);

  app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.urlStyle = process.env.URL_STYLE || "seo";
    next();
  });

  // Main Router
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

// woot!
startServer();
