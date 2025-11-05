#!/usr/bin/env node


require("dotenv").config();

const { initializeDatabase } = require("../config/database");
const query = require("../lib/query-handler");
const snippetService = require("../services/snippet.service");
const categoryService = require("../services/category.service");
const DEMO = require("./demo-snippets");

const args = new Set(process.argv.slice(2));
const RESET = args.has("--reset");
const LIST_ONLY = args.has("--list");

async function main() {
  await initializeDatabase(true);

  const owner = await query.get("SELECT id, username FROM users ORDER BY id LIMIT 1");
  if (!owner) {
    console.error("No user exists yet. Start the server once so the initial admin is created.");
    process.exit(1);
  }

  const wantedCategories = [...new Set(DEMO.map((s) => s.category).filter(Boolean))].sort();
  const wantedLanguages = [...new Set(DEMO.map((s) => s.language).filter(Boolean))].sort();

  if (LIST_ONLY) {
    console.log(`${DEMO.length} snippets`);
    console.log(`${wantedCategories.length} categories: ${wantedCategories.join(", ")}`);
    console.log(`${wantedLanguages.length} languages:  ${wantedLanguages.join(", ")}`);
    const tags = new Set();
    for (const s of DEMO) for (const t of (s.tags || "").split(",")) if (t.trim()) tags.add(t.trim());
    console.log(`${tags.size} tags: ${[...tags].sort().join(", ")}`);
    return;
  }

  if (RESET) {
    const titles = DEMO.map((s) => s.title);
    const placeholders = titles.map(() => "?").join(",");
    const { changes } = await query.run(
      `DELETE FROM snippets WHERE title IN (${placeholders})`,
      titles
    );
    console.log(`reset: removed ${changes ?? 0} demo snippet(s)`);
  }

  const existingCats = await query.all("SELECT id, name FROM categories");
  const catByName = new Map(existingCats.map((c) => [c.name.toLowerCase(), c.id]));
  let catsAdded = 0;
  for (const name of wantedCategories) {
    if (catByName.has(name.toLowerCase())) continue;
    await categoryService.create(name);
    catsAdded += 1;
  }
  const allCats = await query.all("SELECT id, name FROM categories");
  const catId = new Map(allCats.map((c) => [c.name.toLowerCase(), c.id]));

  const allLangs = await query.all("SELECT id, slug FROM languages");
  const langId = new Map(allLangs.map((l) => [l.slug.toLowerCase(), l.id]));
  const missingLangs = wantedLanguages.filter((l) => !langId.has(l.toLowerCase()));
  if (missingLangs.length) {
    console.warn(`note: no language row for ${missingLangs.join(", ")} -- those snippets get no language`);
  }

  const existingTitles = new Set(
    (await query.all("SELECT title FROM snippets")).map((r) => r.title)
  );

  let added = 0;
  let skipped = 0;
  for (const s of DEMO) {
    if (existingTitles.has(s.title)) {
      skipped += 1;
      continue;
    }
    await snippetService.create({
      title: s.title,
      description: s.description,
      code: s.code,
      tags: s.tags || "",
      category_id: s.category ? catId.get(s.category.toLowerCase()) || null : null,
      language_id: s.language ? langId.get(s.language.toLowerCase()) || null : null,
      reference_url: s.reference || null,
      user_id: owner.id,
      is_private: s.private ? 1 : 0,
    });
    added += 1;
  }

  const total = await query.get("SELECT COUNT(*) AS n FROM snippets");
  const publicCount = await query.get("SELECT COUNT(*) AS n FROM snippets WHERE is_private = 0");
  console.log(
    `categories added: ${catsAdded}\n` +
      `snippets added:   ${added}\n` +
      `already present:  ${skipped}\n` +
      `library now:      ${total.n} snippets (${publicCount.n} public), owned by ${owner.username}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
