const query = require("../lib/query-handler");
const slugify = require("../utils/slugify");

const findAll = () => {
  const sql = "SELECT * FROM languages ORDER BY name";
  return query.all(sql);
};

const findBySlug = (slug) => {
  const sql = "SELECT * FROM languages WHERE slug = ?";
  return query.get(sql, [slug]);
};

const findByName = (name) => {
  const sql = "SELECT * FROM languages WHERE name = ?";
  return query.get(sql, [name]);
};

const create = (name) => {
  const slug = slugify(name);
  const sql = "INSERT INTO languages (name, slug) VALUES (?, ?)";
  return query.run(sql, [name, slug]);
};

const update = (id, name) => {
  const slug = slugify(name);
  const sql = "UPDATE languages SET name = ?, slug = ? WHERE id = ?";
  return query.run(sql, [name, slug, id]);
};

const remove = (id) => {
  const sql = "DELETE FROM languages WHERE id = ?";
  return query.run(sql, [id]);
};

const findAllWithCount = () => {
  const sql = `
      SELECT l.id, l.name, l.slug, COUNT(s.id) as count
      FROM languages l
      LEFT JOIN snippets s ON l.id = s.language_id
      GROUP BY l.id
      HAVING COUNT(s.id) > 0
      ORDER BY l.name`;
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
