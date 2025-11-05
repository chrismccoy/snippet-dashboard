/**
 * Reusable wrapper for SQLite3 database operations.
 */

const { getDb } = require("../config/database");

/**
 * Executes a SQL query that does not return any rows (INSERT, UPDATE, DELETE).
 */
function run(sql, params = []) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error(`Error running SQL: ${sql}`);
        console.error(err);
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

/**
 * Executes a SQL query that is expected to return a single row.
 */
function get(sql, params = []) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        console.error(`Error running SQL: ${sql}`);
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Executes a SQL query that is expected to return multiple rows.
 */
function all(sql, params = []) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error(`Error running SQL: ${sql}`);
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  run,
  get,
  all,
};
