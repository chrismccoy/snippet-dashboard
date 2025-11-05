const query = require("../lib/query-handler");
const slugify = require("../utils/slugify");
const ShortUniqueId = require("short-unique-id");

const uid = new ShortUniqueId({ length: 8 });

const BASE_SNIPPET_QUERY = `
    SELECT
      s.id, s.title, s.slug, s.short_id, s.description, s.tags, s.created_at, s.code, s.is_private,
      s.category_id, s.reference_url,
      c.name as category_name, c.slug as category_slug,
      l.name as language_name, l.slug as language_slug,
      u.username as author_name
    FROM snippets s
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN languages l ON s.language_id = l.id
    LEFT JOIN users u ON s.user_id = u.id
`;

const findById = (id) => {
  const sql = "SELECT * FROM snippets WHERE id = ?";
  return query.get(sql, [id]);
};

const create = async (snippetData) => {
  const {
    title,
    description,
    code,
    tags,
    category_id,
    reference_url,
    language_id,
    user_id,
    is_private = 0,
  } = snippetData;

  let slug = slugify(title);

  const shortId = uid.rnd();

  const slugExists = await query.get("SELECT id FROM snippets WHERE slug = ?", [
    slug,
  ]);

  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

  const sql = `
    INSERT INTO snippets
      (title, description, code, tags, category_id, reference_url, language_id, slug, short_id, user_id, is_private)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    title,
    description,
    code,
    tags,
    category_id || null,
    reference_url,
    language_id || null,
    slug,
    shortId,
    user_id,
    is_private,
  ];
  return query.run(sql, params);
};

const update = async (id, user, snippetData) => {
  const {
    title,
    description,
    code,
    tags,
    category_id,
    reference_url,
    language_id,
    is_private = 0,
  } = snippetData;

  const currentSnippet = await findById(id);
  if (!currentSnippet) {
    throw new Error("Snippet not found for update.");
  }

  let finalSlug = currentSnippet.slug;

  if (title !== currentSnippet.title) {
    let newSlugCandidate = slugify(title);

    const conflictingSnippet = await query.get(
      "SELECT id FROM snippets WHERE slug = ? AND id != ?",
      [newSlugCandidate, id]
    );

    if (conflictingSnippet) {
      newSlugCandidate = `${newSlugCandidate}-${Date.now()}`;
    }
    finalSlug = newSlugCandidate;
  }

  let sql = `
    UPDATE snippets SET
      title = ?, description = ?, code = ?, tags = ?, category_id = ?,
      reference_url = ?, language_id = ?, slug = ?, is_private = ?
    WHERE id = ?
  `;
  const params = [
    title,
    description,
    code,
    tags,
    category_id || null,
    reference_url,
    language_id || null,
    finalSlug,
    is_private,
    id,
  ];

  if (!user.is_admin) {
    sql += ` AND user_id = ?`;
    params.push(user.id);
  }

  return query.run(sql, params);
};

const remove = (id, user) => {
  let sql = "DELETE FROM snippets WHERE id = ?";
  const params = [id];

  if (!user.is_admin) {
    sql += ` AND user_id = ?`;
    params.push(user.id);
  }
  return query.run(sql, params);
};

const findAllForAdmin = () => {
  const sql = `
    SELECT s.id, s.title, s.slug, s.short_id, s.description, s.is_private,
           c.name as category_name,
           u.username as author_name
    FROM snippets s
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `;
  return query.all(sql);
};

const findAllForUser = (userId) => {
  const sql = `
    SELECT s.id, s.title, s.slug, s.short_id, s.description, s.is_private,
           c.name as category_name
    FROM snippets s
    LEFT JOIN categories c ON s.category_id = c.id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC
  `;
  return query.all(sql, [userId]);
};

const PUBLIC_FILTER = `s.is_private = 0 AND u.is_approved = 1 AND`;

const findRelated = (snippetId, categoryId, limit) => {
  if (!categoryId) return Promise.resolve([]);
  const sql = `
    ${BASE_SNIPPET_QUERY}
    WHERE ${PUBLIC_FILTER} s.id != ? AND s.category_id = ?
    ORDER BY RANDOM()
    LIMIT ?
  `;
  return query.all(sql, [snippetId, categoryId, limit]);
};

const findRandomOthers = (snippetId, limit, excludeIds = []) => {
  const excluded = [snippetId, ...excludeIds];
  const placeholders = excluded.map(() => "?").join(", ");
  const sql = `
    ${BASE_SNIPPET_QUERY}
    WHERE ${PUBLIC_FILTER} s.id NOT IN (${placeholders})
    ORDER BY RANDOM()
    LIMIT ?
  `;
  return query.all(sql, [...excluded, limit]);
};

const countForUser = async (userId) => {
  const sql = `SELECT COUNT(*) as count FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} s.user_id = ?`;
  const row = await query.get(sql, [userId]);
  return row.count;
};

const findPaginatedForUser = (userId, page, limit) => {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT
      s.id, s.title, s.slug, s.short_id, s.description, s.tags, s.created_at,
      c.name as category_name,
      l.name as language_name
    FROM snippets s
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN languages l ON s.language_id = l.id
    LEFT JOIN users u ON s.user_id = u.id -- Join users for PUBLIC_FILTER
    WHERE ${PUBLIC_FILTER} s.user_id = ?
    ORDER BY s.created_at DESC
    LIMIT ? OFFSET ?
  `;
  return query.all(sql, [userId, limit, offset]);
};


const countAll = async () => {
  const sql = `SELECT COUNT(s.id) as count FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} 1`;
  const row = await query.get(sql);
  return row.count;
};

const findPaginated = (page, limit) => {
  const offset = (page - 1) * limit;
  const sql = `${BASE_SNIPPET_QUERY} WHERE ${PUBLIC_FILTER} 1 ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
  return query.all(sql, [limit, offset]);
};

const countByCategory = async (categoryId) => {
  const sql = `SELECT COUNT(s.id) as count FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} s.category_id = ?`;
  const row = await query.get(sql, [categoryId]);
  return row.count;
};

const findPaginatedByCategory = (categoryId, page, limit) => {
  const offset = (page - 1) * limit;
  const sql = `${BASE_SNIPPET_QUERY} WHERE ${PUBLIC_FILTER} s.category_id = ? ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
  return query.all(sql, [categoryId, limit, offset]);
};

const countByLanguage = async (languageId) => {
  const sql = `SELECT COUNT(s.id) as count FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} s.language_id = ?`;
  const row = await query.get(sql, [languageId]);
  return row.count;
};

const findPaginatedByLanguage = (languageId, page, limit) => {
  const offset = (page - 1) * limit;
  const sql = `${BASE_SNIPPET_QUERY} WHERE ${PUBLIC_FILTER} s.language_id = ? ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
  return query.all(sql, [languageId, limit, offset]);
};

const countByAuthor = async (username) => {
  const sql = `SELECT COUNT(s.id) as count FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} u.username = ?`;
  const row = await query.get(sql, [username]);
  return row.count;
};

const findPaginatedByAuthor = (username, page, limit) => {
  const offset = (page - 1) * limit;
  const sql = `${BASE_SNIPPET_QUERY} WHERE ${PUBLIC_FILTER} u.username = ? ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
  return query.all(sql, [username, limit, offset]);
};

const countByTag = async (tag) => {
  const searchTerm = `%${tag}%`;
  const sql = `SELECT COUNT(s.id) as count FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} s.tags LIKE ?`;
  const row = await query.get(sql, [searchTerm]);
  return row.count;
};

const findPaginatedByTag = (tag, page, limit) => {
  const offset = (page - 1) * limit;
  const searchTerm = `%${tag}%`;
  const sql = `${BASE_SNIPPET_QUERY} WHERE ${PUBLIC_FILTER} s.tags LIKE ? ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
  return query.all(sql, [searchTerm, limit, offset]);
};

const countSearchResults = async (searchQuery) => {
  const searchTerm = `%${searchQuery}%`;
  const sql = `SELECT COUNT(s.id) as count FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} (s.title LIKE ? OR s.description LIKE ? OR s.code LIKE ?)`;
  const row = await query.get(sql, [searchTerm, searchTerm, searchTerm]);
  return row.count;
};

const search = (searchQuery, page, limit) => {
  const offset = (page - 1) * limit;
  const searchTerm = `%${searchQuery}%`;
  const sql = `${BASE_SNIPPET_QUERY} WHERE ${PUBLIC_FILTER} (s.title LIKE ? OR s.description LIKE ? OR s.code LIKE ?) ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
  return query.all(sql, [searchTerm, searchTerm, searchTerm, limit, offset]);
};

const findRecent = (limit = 5) => {
  const sql = `SELECT s.id, s.title, s.slug, s.short_id FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} 1 ORDER BY s.created_at DESC LIMIT ?`;
  return query.all(sql, [limit]);
};

const findByIdentifierWithDetail = (identifier) => {
  const sql = `${BASE_SNIPPET_QUERY} WHERE s.slug = ? OR s.short_id = ?`;
  return query.get(sql, [identifier, identifier]);
};

const findAllTags = async () => {
  const sql = `SELECT tags FROM snippets s JOIN users u ON s.user_id = u.id WHERE ${PUBLIC_FILTER} s.tags IS NOT NULL AND s.tags != ''`;
  const rows = await query.all(sql);
  const tagCounts = {};
  rows.forEach((row) => {
    row.tags.split(",").forEach((tag) => {
      const trimmedTag = tag.trim();
      if (trimmedTag) {
        tagCounts[trimmedTag] = (tagCounts[trimmedTag] || 0) + 1;
      }
    });
  });

  const sortedTags = Object.keys(tagCounts)
    .sort()
    .map((tag) => ({
      name: tag,
      count: tagCounts[tag],
    }));
  return sortedTags;
};

module.exports = {
  findRelated,
  findRandomOthers,
  findById,
  create,
  update,
  remove,
  findAllForAdmin,
  findAllForUser,
  countForUser,
  findPaginatedForUser,
  countAll,
  findPaginated,
  countByCategory,
  findPaginatedByCategory,
  countByLanguage,
  findPaginatedByLanguage,
  countByAuthor,
  findPaginatedByAuthor,
  countByTag,
  findPaginatedByTag,
  countSearchResults,
  search,
  findRecent,
  findByIdentifierWithDetail,
  findAllTags,
};
