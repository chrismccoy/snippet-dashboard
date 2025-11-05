const query = require("../lib/query-handler");
const slugify = require("../utils/slugify");

const findAll = () => {
  const sql = "SELECT id, name, slug FROM categories ORDER BY name";
  return query.all(sql);
};

const findBySlug = (slug) => {
  const sql = "SELECT * FROM categories WHERE slug = ?";
  return query.get(sql, [slug]);
};

const findByName = (name) => {
  const sql = "SELECT * FROM categories WHERE name = ?";
  return query.get(sql, [name]);
};

const create = (name) => {
  const slug = slugify(name);
  const sql = "INSERT INTO categories (name, slug) VALUES (?, ?)";
  return query.run(sql, [name, slug]);
};

const update = (id, name) => {
  const slug = slugify(name);
  const sql = "UPDATE categories SET name = ?, slug = ? WHERE id = ?";
  return query.run(sql, [name, slug, id]);
};

const remove = (id) => {
  const sql = "DELETE FROM categories WHERE id = ?";
  return query.run(sql, [id]);
};

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
