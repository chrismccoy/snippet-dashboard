/**
 * Service for category database operations.
 */

const query = require("../lib/query-handler");
const slugify = require("../utils/slugify");

/**
 * Retrieves all categories, ordered by name.
 */
const findAll = () => {
  const sql = "SELECT id, name, slug FROM categories ORDER BY name";
  return query.all(sql);
};

/**
 * Finds a single category by its slug.
 */
const findBySlug = (slug) => {
  const sql = "SELECT * FROM categories WHERE slug = ?";
  return query.get(sql, [slug]);
};

/**
 * Finds a single category by its exact name.
 */
const findByName = (name) => {
  const sql = "SELECT * FROM categories WHERE name = ?";
  return query.get(sql, [name]);
};

/**
 * Creates a new category.
 */
const create = (name) => {
  const slug = slugify(name);
  const sql = "INSERT INTO categories (name, slug) VALUES (?, ?)";
  return query.run(sql, [name, slug]);
};

/**
 * Updates an existing category.
 */
const update = (id, name) => {
  const slug = slugify(name);
  const sql = "UPDATE categories SET name = ?, slug = ? WHERE id = ?";
  return query.run(sql, [name, slug, id]);
};

/**
 * Deletes a category by its ID.
 */
const remove = (id) => {
  const sql = "DELETE FROM categories WHERE id = ?";
  return query.run(sql, [id]);
};

/**
 * Retrieves all categories that have at least one associated snippet,
 */
const findAllWithCount = () => {
  const sql = `
      SELECT c.id, c.name, c.slug, COUNT(s.id) as count
      FROM categories c
      LEFT JOIN snippets s ON c.id = s.category_id
      GROUP BY c.id
      HAVING COUNT(s.id) > 0
      ORDER BY c.name`;
  return query.all(sql);
};

module.exports = {
  findAll,
  findBySlug,
  findByName,
  create,
  update,
  remove,
  findAllWithCount,
};
