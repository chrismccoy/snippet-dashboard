/**
 * Database configuration and initialization.
 */

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const languageExtensionMap = require("../utils/language-map");
const authService = require("../services/auth.service");

// Directory where database files (snippets.db, sessions.db) are stored.
const dataDir = path.join(__dirname, "../data");
const dbPath = path.join(dataDir, "snippets.db");

// Ensure the 'data' directory exists; create it if it doesn't.
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

let db;

/**
 * Creates all necessary database tables if they don't already exist.
 */
function createTables(silent = false) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          api_key TEXT UNIQUE,
          is_admin BOOLEAN DEFAULT 0,
          is_approved BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      );
      db.run(
        `CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE)`
      );
      db.run(
        `CREATE TABLE IF NOT EXISTS languages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE)`
      );
      db.run(
        `CREATE TABLE IF NOT EXISTS snippets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          short_id TEXT UNIQUE,
          description TEXT,
          code TEXT NOT NULL,
          tags TEXT,
          reference_url TEXT,
          category_id INTEGER,
          language_id INTEGER,
          user_id INTEGER,
          is_private BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
        (err) => {
          if (err) return reject(err);
          // Only log table creation message if not in silent mode.
          if (!silent) {
            console.log("Database tables checked/created successfully.");
          }
          resolve();
        }
      );
    });
  });
}

/**
 * Seeds the initial administrator user from environment variables if no admin
 * user currently exists in the database.
 */
function seedAdminUser(silent = false) {
  return new Promise((resolve, reject) => {
    // Get admin credentials from environment variables.
    const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL } = process.env;
    // Skip seeding if credentials are not provided
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_EMAIL) {
      if (!silent) {
        console.log("Initial admin credentials not found in .env, skipping admin seed.");
      }
      return resolve();
    }

    db.get(
      "SELECT COUNT(*) as count FROM users WHERE is_admin = 1",
      async (err, row) => {
        if (err) return reject(err);
        if (row.count > 0) {
          // If an admin already exists, skip creating a new one.
          if (!silent) {
            console.log("Admin user(s) already exist.");
          }
          return resolve();
        }

        // If no admin exists, proceed to create the initial admin user.
        if (!silent) {
          console.log("No admin user found, creating initial admin...");
        }
        const passwordHash = await authService.hashPassword(ADMIN_PASSWORD);
        const apiKey = authService.generateApiKey();
        const sql = `INSERT INTO users (username, email, password_hash, api_key, is_admin, is_approved) VALUES (?, ?, ?, ?, 1, 1)`;
        db.run(
          sql,
          [ADMIN_USERNAME, ADMIN_EMAIL, passwordHash, apiKey],
          (err) => {
            if (err) return reject(err);
            if (!silent) {
              console.log(`Admin user '${ADMIN_USERNAME}' created successfully.`);
            }
            resolve();
          }
        );
      }
    );
  });
}

/**
 * Seeds the 'languages' table from the `language-map.js` file.
 */
function seedLanguages(silent = false) {
  return new Promise((resolve, reject) => {
    const mapSlugs = Object.keys(languageExtensionMap);

    db.all("SELECT slug FROM languages", [], (err, rows) => {
      if (err) return reject(err);
      const existingSlugs = rows.map((row) => row.slug);

      const newSlugs = mapSlugs.filter(
        (slug) => !existingSlugs.includes(slug)
      );

      if (newSlugs.length === 0) {
        if (!silent) {
          console.log("Languages are up to date.");
        }
        return resolve();
      }

      if (!silent) {
        console.log(`Seeding ${newSlugs.length} new language(s)...`);
      }

      const stmt = db.prepare(
        "INSERT INTO languages (name, slug) VALUES (?, ?)"
      );
      for (const slug of newSlugs) {
        const name = slug.charAt(0).toUpperCase() + slug.slice(1);
        stmt.run(name, slug);
      }

      stmt.finalize((err) => {
        if (err) return reject(err);
        if (!silent) {
          console.log("Language seeding complete.");
        }
        resolve();
      });
    });
  });
}

/**
 * Database initialization process.
 */
function initializeDatabase(silent = false) {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Could not connect to database", err);
        return reject(err);
      }
      if (!silent) {
        console.log("\nConnected to the SQLite database.");
      }
      resolve();
    });
  })
    .then(() => createTables(silent)) // Create tables, passing silent flag.
    .then(() => seedAdminUser(silent)) // Seed admin, passing silent flag.
    .then(() => seedLanguages(silent)) // Seed languages, passing silent flag.
    .then(async () => {
      // After all setup and seeding, collect and log a database summary.
      const getCount = (tableName) =>
        new Promise((res, rej) => {
          db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
            if (err) return rej(err);
            res(row ? row.count : 0);
          });
        });

      const [snippetCount, categoryCount, languageCount, userCount] = await Promise.all([
        getCount("snippets"),
        getCount("categories"),
        getCount("languages"),
        getCount("users"),
      ]);

      if (!silent) {
        console.log(
          `\n📊 Database Summary: \x1b[32m${snippetCount}\x1b[0m snippets, \x1b[33m${categoryCount}\x1b[0m categories, \x1b[34m${languageCount}\x1b[0m languages, \x1b[35m${userCount}\x1b[0m users.`
        );
      }
    });
}

/**
 * A getter function for the database instance.
 */
function getDb() {
  if (!db) {
    throw new Error("Database connection has not been initialized.");
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDb,
};
