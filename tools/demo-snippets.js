const lines = (...l) => l.join("\n");

module.exports = [
  {
    title: "Find the largest files under a directory",
    description: "Sorts everything beneath the working directory by real disk usage and shows the twenty worst offenders.",
    language: "bash", category: "Shell", tags: "disk,du,sort",
    code: lines(
      "# -a counts files as well as directories, -h prints human sizes",
      "du -ah . 2>/dev/null \\",
      "  | sort -rh \\",
      "  | head -20"
    ),
  },
  {
    title: "Delete files older than thirty days",
    description: "Prunes an archive directory without touching anything recent. Run it with -print first to see what would go.",
    language: "bash", category: "Shell", tags: "find,cleanup,cron",
    code: lines(
      "# Dry run first:",
      "find /var/backups -type f -mtime +30 -print",
      "",
      "# Then delete:",
      "find /var/backups -type f -mtime +30 -delete"
    ),
  },
  {
    title: "Watch a command until it succeeds",
    description: "Retries every two seconds and stops the moment the command exits zero. Useful while waiting for a service to come up.",
    language: "bash", category: "Shell", tags: "retry,waiting",
    code: lines(
      "until curl -sf http://localhost:8080/health >/dev/null; do",
      "  echo 'waiting for health check...'",
      "  sleep 2",
      "done",
      "echo 'up'"
    ),
  },
  {
    title: "Show which process is holding a port",
    description: "Answers 'address already in use' without guessing.",
    language: "bash", category: "Shell", tags: "network,ports,debugging",
    code: lines(
      "ss -ltnp | grep ':3000'",
      "",
      "# macOS, or where ss is unavailable:",
      "lsof -nP -iTCP:3000 -sTCP:LISTEN"
    ),
  },
  {
    title: "Rename a batch of files with a pattern",
    description: "Strips a prefix from every file in a directory using shell parameter expansion, no rename utility required.",
    language: "bash", category: "Shell", tags: "rename,batch,globbing",
    code: lines(
      'for f in IMG_*.jpg; do',
      '  mv -- "$f" "${f#IMG_}"',
      'done'
    ),
  },
  {
    title: "Tail a log and colour only what matters",
    description: "Follows a growing file and highlights errors and warnings, leaving the rest readable but quiet.",
    language: "bash", category: "Shell", tags: "logs,grep,sed",
    code: lines(
      "tail -F /var/log/app.log \\",
      "  | grep --line-buffered -E 'ERROR|WARN' \\",
      "  | sed -u 's/ERROR/\\x1b[31m&\\x1b[0m/'"
    ),
  },
  {
    title: "Make a shell script fail loudly",
    description: "The four lines that turn a script from 'carries on after an error' into 'stops at the first problem'.",
    language: "bash", category: "Shell", tags: "safety,strict-mode",
    code: lines(
      "#!/usr/bin/env bash",
      "set -Eeuo pipefail",
      "trap 'echo \"failed at line $LINENO\" >&2' ERR",
      "IFS=$'\\n\\t'"
    ),
  },
  {
    title: "Count lines of code by extension",
    description: "A quick census of a repository without installing a tool for it.",
    language: "bash", category: "Shell", tags: "stats,find,wc",
    code: lines(
      "find . -type f -name '*.js' -not -path './node_modules/*' \\",
      "  | xargs wc -l \\",
      "  | tail -1"
    ),
  },
  {
    title: "Run a command on every file changed in a commit",
    description: "Lints only what a commit touched, which is usually all you need in a pre-commit hook.",
    language: "bash", category: "Shell", tags: "git,hooks,lint",
    code: lines(
      "git diff --name-only --diff-filter=ACM HEAD~1 HEAD \\",
      "  | grep '\\.js$' \\",
      "  | xargs --no-run-if-empty npx eslint"
    ),
  },
  {
    title: "Serve the current directory over HTTP",
    description: "Three ways to put a folder on localhost when you need to test something quickly.",
    language: "bash", category: "Shell", tags: "http,static,quick",
    code: lines(
      "python3 -m http.server 8000",
      "npx --yes serve .",
      "php -S localhost:8000"
    ),
  },

  {
    title: "Undo the last commit but keep the changes",
    description: "Moves HEAD back one commit and leaves everything staged, which is what you usually want after committing too early.",
    language: "bash", category: "Git", tags: "git,undo,reset",
    code: lines(
      "git reset --soft HEAD~1",
      "",
      "# Keep the changes but unstage them as well:",
      "git reset HEAD~1"
    ),
  },
  {
    title: "Find the commit that introduced a bug",
    description: "Binary search across history. Mark a known good and a known bad commit and git narrows it down for you.",
    language: "bash", category: "Git", tags: "git,bisect,debugging",
    code: lines(
      "git bisect start",
      "git bisect bad                 # current HEAD is broken",
      "git bisect good v1.4.0         # this tag was fine",
      "# test, then: git bisect good | git bisect bad",
      "git bisect reset"
    ),
  },
  {
    title: "Search the whole history for a string",
    description: "Finds every commit whose diff added or removed a piece of text, including in files long since deleted.",
    language: "bash", category: "Git", tags: "git,search,history",
    code: lines(
      "git log -S 'AWS_SECRET_KEY' --oneline --all",
      "",
      "# With the surrounding diff:",
      "git log -S 'AWS_SECRET_KEY' -p --all"
    ),
  },
  {
    title: "Recover a branch you deleted",
    description: "The reflog remembers where HEAD has been for about ninety days, so a deleted branch is almost never really gone.",
    language: "bash", category: "Git", tags: "git,reflog,recovery",
    code: lines(
      "git reflog",
      "git branch recovered-work <sha-from-the-reflog>"
    ),
  },
  {
    title: "Amend a commit without changing its message",
    description: "Adds forgotten files to the previous commit and leaves the message exactly as it was.",
    language: "bash", category: "Git", tags: "git,amend",
    code: lines(
      "git add path/to/forgotten-file",
      "git commit --amend --no-edit"
    ),
  },
  {
    title: "Show what a merge will do before doing it",
    description: "Lists the commits and the files a merge would bring in, so a surprise is less likely.",
    language: "bash", category: "Git", tags: "git,merge,review",
    code: lines(
      "git log --oneline HEAD..feature-branch",
      "git diff --stat HEAD...feature-branch"
    ),
  },
  {
    title: "Stop tracking a file without deleting it",
    description: "For the config file that should never have been committed. Add it to .gitignore afterwards.",
    language: "bash", category: "Git", tags: "git,gitignore",
    code: lines(
      "git rm --cached config/local.json",
      "echo 'config/local.json' >> .gitignore",
      "git commit -m 'stop tracking local config'"
    ),
  },
  {
    title: "List branches merged into main",
    description: "Finds the branches that are safe to delete, and the ones that are not.",
    language: "bash", category: "Git", tags: "git,branches,cleanup",
    code: lines(
      "git branch --merged main",
      "",
      "# Not yet merged -- do not delete these:",
      "git branch --no-merged main"
    ),
  },

  {
    title: "Multi-stage Dockerfile for a Node service",
    description: "Builds with the full toolchain, ships only production dependencies, and runs as a non-root user.",
    language: "plaintext", category: "Containers", tags: "docker,node,dockerfile",
    code: lines(
      "FROM node:22-slim AS build",
      "WORKDIR /app",
      "COPY package*.json ./",
      "RUN npm ci",
      "COPY . .",
      "RUN npm run build",
      "",
      "FROM node:22-slim",
      "WORKDIR /app",
      "ENV NODE_ENV=production",
      "COPY package*.json ./",
      "RUN npm ci --omit=dev && npm cache clean --force",
      "COPY --from=build /app/dist ./dist",
      "USER node",
      "EXPOSE 3000",
      'CMD ["node", "dist/server.js"]'
    ),
  },
  {
    title: "Remove every stopped container and dangling image",
    description: "Reclaims disk after a week of building. The volume flag is separate because it is the one that loses data.",
    language: "bash", category: "Containers", tags: "docker,cleanup,disk",
    code: lines(
      "docker system prune -f",
      "",
      "# Including unused volumes -- this deletes data:",
      "docker system prune -a --volumes"
    ),
  },
  {
    title: "Shell into a running container",
    description: "Falls back to sh, since slim images often have no bash.",
    language: "bash", category: "Containers", tags: "docker,debugging",
    code: lines(
      "docker exec -it my-service bash \\",
      "  || docker exec -it my-service sh"
    ),
  },
  {
    title: "Compose file with a healthcheck and dependency order",
    description: "Makes the app wait until Postgres actually answers, not merely until its container has started.",
    language: "yaml", category: "Containers", tags: "docker,compose,postgres",
    code: lines(
      "services:",
      "  db:",
      "    image: postgres:17",
      "    environment:",
      "      POSTGRES_PASSWORD: example",
      "    healthcheck:",
      '      test: ["CMD-SHELL", "pg_isready -U postgres"]',
      "      interval: 5s",
      "      retries: 10",
      "",
      "  app:",
      "    build: .",
      "    depends_on:",
      "      db:",
      "        condition: service_healthy"
    ),
  },
  {
    title: "Find what is taking up space in an image",
    description: "Prints the size each layer adds, which usually points straight at the offending RUN line.",
    language: "bash", category: "Containers", tags: "docker,images,size",
    code: lines(
      "docker history --no-trunc --format '{{.Size}}\\t{{.CreatedBy}}' my-image:latest"
    ),
  },
  {
    title: "Reset a Postgres sequence after a bulk import",
    description: "Copying rows with explicit ids leaves the identity sequence behind, so the next insert collides with an existing row.",
    language: "sql", category: "Databases", tags: "postgres,migrations,sequences",
    code: lines(
      "SELECT setval(",
      "  pg_get_serial_sequence('users', 'id'),",
      "  COALESCE((SELECT MAX(id) FROM users), 1)",
      ");"
    ),
  },
  {
    title: "Find slow queries in Postgres",
    description: "Ranks statements by total time spent. Needs the pg_stat_statements extension enabled.",
    language: "sql", category: "Databases", tags: "postgres,performance",
    code: lines(
      "SELECT",
      "  round(total_exec_time::numeric, 1) AS total_ms,",
      "  calls,",
      "  round(mean_exec_time::numeric, 2) AS mean_ms,",
      "  query",
      "FROM pg_stat_statements",
      "ORDER BY total_exec_time DESC",
      "LIMIT 20;"
    ),
  },
  {
    title: "Delete duplicate rows, keeping the oldest",
    description: "Uses a window function to number the duplicates and removes everything but the first of each group.",
    language: "sql", category: "Databases", tags: "postgres,duplicates,cleanup",
    code: lines(
      "DELETE FROM contacts",
      "WHERE id IN (",
      "  SELECT id FROM (",
      "    SELECT id,",
      "           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn",
      "    FROM contacts",
      "  ) ranked",
      "  WHERE ranked.rn > 1",
      ");"
    ),
  },
  {
    title: "Add a column without locking the table",
    description: "On Postgres 11 and later a nullable column with a default is a metadata-only change. Adding NOT NULL afterwards is the part that needs care.",
    language: "sql", category: "Databases", tags: "postgres,migrations,locking",
    code: lines(
      "ALTER TABLE orders ADD COLUMN status text DEFAULT 'pending';",
      "",
      "-- Backfill in batches, then:",
      "ALTER TABLE orders ADD CONSTRAINT orders_status_not_null",
      "  CHECK (status IS NOT NULL) NOT VALID;",
      "ALTER TABLE orders VALIDATE CONSTRAINT orders_status_not_null;"
    ),
  },
  {
    title: "Which indexes is nobody using?",
    description: "Lists indexes that have never been scanned, which are pure write cost. Check against a long uptime before dropping any.",
    language: "sql", category: "Databases", tags: "postgres,indexes,performance",
    code: lines(
      "SELECT",
      "  relname AS table_name,",
      "  indexrelname AS index_name,",
      "  idx_scan,",
      "  pg_size_pretty(pg_relation_size(indexrelid)) AS size",
      "FROM pg_stat_user_indexes",
      "WHERE idx_scan = 0",
      "ORDER BY pg_relation_size(indexrelid) DESC;"
    ),
  },
  {
    title: "Upsert a row in SQLite",
    description: "Inserts, or updates the existing row when the unique column already holds that value.",
    language: "sql", category: "Databases", tags: "sqlite,upsert",
    code: lines(
      "INSERT INTO settings (key, value)",
      "VALUES ('theme', 'dark')",
      "ON CONFLICT(key) DO UPDATE SET",
      "  value = excluded.value,",
      "  updated_at = CURRENT_TIMESTAMP;"
    ),
  },
  {
    title: "Table sizes, largest first",
    description: "Where the disk actually went, including indexes and TOAST.",
    language: "sql", category: "Databases", tags: "postgres,disk,sizes",
    code: lines(
      "SELECT",
      "  relname,",
      "  pg_size_pretty(pg_total_relation_size(relid)) AS total,",
      "  pg_size_pretty(pg_relation_size(relid)) AS heap",
      "FROM pg_catalog.pg_statio_user_tables",
      "ORDER BY pg_total_relation_size(relid) DESC",
      "LIMIT 20;"
    ),
  },
  {
    title: "Group rows into a JSON array",
    description: "Returns one row per author with their posts nested, instead of a join that repeats the author on every row.",
    language: "sql", category: "Databases", tags: "postgres,json,aggregation",
    code: lines(
      "SELECT",
      "  a.name,",
      "  json_agg(json_build_object('id', p.id, 'title', p.title)",
      "           ORDER BY p.published_at DESC) AS posts",
      "FROM authors a",
      "JOIN posts p ON p.author_id = a.id",
      "GROUP BY a.id, a.name;"
    ),
  },

  {
    title: "Debounce without pulling in a library",
    description: "Twelve lines covering the case most projects add a dependency for, including cancelling a call that has not fired yet.",
    language: "javascript", category: "JavaScript", tags: "timing,events",
    code: lines(
      "function debounce(fn, wait = 250) {",
      "  let timer;",
      "  const run = (...args) => {",
      "    clearTimeout(timer);",
      "    timer = setTimeout(() => fn(...args), wait);",
      "  };",
      "  run.cancel = () => clearTimeout(timer);",
      "  return run;",
      "}"
    ),
  },
  {
    title: "Throttle with a trailing call",
    description: "Runs at most once per interval but still fires once more after the last event, so the final state is never dropped.",
    language: "javascript", category: "JavaScript", tags: "timing,events,scroll",
    code: lines(
      "function throttle(fn, wait = 100) {",
      "  let last = 0;",
      "  let timer;",
      "  return (...args) => {",
      "    const now = Date.now();",
      "    const remaining = wait - (now - last);",
      "    clearTimeout(timer);",
      "    if (remaining <= 0) {",
      "      last = now;",
      "      fn(...args);",
      "    } else {",
      "      timer = setTimeout(() => { last = Date.now(); fn(...args); }, remaining);",
      "    }",
      "  };",
      "}"
    ),
  },
  {
    title: "Group an array by a key",
    description: "Object.groupBy is available in current runtimes; the reduce version is the fallback for older ones.",
    language: "javascript", category: "JavaScript", tags: "arrays,grouping",
    code: lines(
      "const byStatus = Object.groupBy(orders, (o) => o.status);",
      "",
      "// Older runtimes:",
      "const grouped = orders.reduce((acc, o) => {",
      "  (acc[o.status] ||= []).push(o);",
      "  return acc;",
      "}, {});"
    ),
  },
  {
    title: "Retry a fetch with exponential backoff",
    description: "Backs off on each failure and adds jitter, so a recovering service is not hit by every client at the same moment.",
    language: "javascript", category: "JavaScript", tags: "http,resilience,retry",
    code: lines(
      "async function retry(fn, attempts = 5, base = 300) {",
      "  for (let n = 0; n < attempts; n++) {",
      "    try {",
      "      return await fn();",
      "    } catch (err) {",
      "      if (n === attempts - 1) throw err;",
      "      const wait = base * 2 ** n + Math.random() * 100;",
      "      await new Promise((r) => setTimeout(r, wait));",
      "    }",
      "  }",
      "}"
    ),
  },
  {
    title: "Fetch with a timeout",
    description: "fetch has no timeout of its own. AbortSignal.timeout is the short way to give it one.",
    language: "javascript", category: "JavaScript", tags: "http,fetch,timeout",
    code: lines(
      "const res = await fetch(url, { signal: AbortSignal.timeout(5000) });",
      "",
      "// Where AbortSignal.timeout is unavailable:",
      "const ac = new AbortController();",
      "const t = setTimeout(() => ac.abort(), 5000);",
      "try {",
      "  const res2 = await fetch(url, { signal: ac.signal });",
      "} finally {",
      "  clearTimeout(t);",
      "}"
    ),
  },
  {
    title: "Run promises with a concurrency limit",
    description: "Keeps a fixed number of jobs in flight rather than firing a thousand requests at once.",
    language: "javascript", category: "JavaScript", tags: "promises,concurrency",
    code: lines(
      "async function pool(items, limit, worker) {",
      "  const results = [];",
      "  const running = new Set();",
      "  for (const item of items) {",
      "    const p = Promise.resolve().then(() => worker(item));",
      "    results.push(p);",
      "    running.add(p);",
      "    p.finally(() => running.delete(p));",
      "    if (running.size >= limit) await Promise.race(running);",
      "  }",
      "  return Promise.all(results);",
      "}"
    ),
  },
  {
    title: "Deep clone a value",
    description: "structuredClone handles Dates, Maps, Sets and cycles, which JSON round-tripping quietly destroys.",
    language: "javascript", category: "JavaScript", tags: "objects,cloning",
    code: lines(
      "const copy = structuredClone(original);",
      "",
      "// What JSON.parse(JSON.stringify(x)) loses:",
      "//   Date      -> string",
      "//   undefined -> dropped",
      "//   Map, Set  -> {}",
      "//   cycles    -> throws"
    ),
  },
  {
    title: "Format a number as currency",
    description: "Intl handles the symbol, the separators and the decimal places for the locale, so you never hand-roll them.",
    language: "javascript", category: "JavaScript", tags: "intl,formatting",
    code: lines(
      "const gbp = new Intl.NumberFormat('en-GB', {",
      "  style: 'currency',",
      "  currency: 'GBP',",
      "});",
      "",
      "gbp.format(1234.5);   // '£1,234.50'"
    ),
  },
  {
    title: "Relative time without a date library",
    description: "Turns a timestamp into 'three days ago' using the built-in formatter.",
    language: "javascript", category: "JavaScript", tags: "intl,dates,formatting",
    code: lines(
      "const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });",
      "const DIVISIONS = [",
      "  [60, 'second'], [60, 'minute'], [24, 'hour'],",
      "  [7, 'day'], [4.34524, 'week'], [12, 'month'],",
      "];",
      "",
      "function ago(date) {",
      "  let duration = (date - Date.now()) / 1000;",
      "  for (const [amount, unit] of DIVISIONS) {",
      "    if (Math.abs(duration) < amount) return rtf.format(Math.round(duration), unit);",
      "    duration /= amount;",
      "  }",
      "  return rtf.format(Math.round(duration), 'year');",
      "}"
    ),
  },
  {
    title: "Copy text to the clipboard",
    description: "The modern API needs a secure context and a real user gesture, so the failure path matters as much as the success one.",
    language: "javascript", category: "JavaScript", tags: "clipboard,browser",
    code: lines(
      "async function copy(text, button) {",
      "  try {",
      "    await navigator.clipboard.writeText(text);",
      "    button.textContent = 'Copied';",
      "  } catch {",
      "    button.textContent = 'Press Ctrl+C';",
      "  }",
      "  setTimeout(() => { button.textContent = 'Copy'; }, 2000);",
      "}"
    ),
  },
  {
    title: "Retry with exponential backoff and jitter",
    description: "Backs off on each failure and spreads retries out, so a recovering service is not hit by every client at once.",
    language: "python", category: "Python", tags: "resilience,http,retry",
    code: lines(
      "import random, time",
      "",
      "def retry(fn, attempts=5, base=0.5):",
      "    for n in range(attempts):",
      "        try:",
      "            return fn()",
      "        except TransientError:",
      "            if n == attempts - 1:",
      "                raise",
      "            time.sleep(base * 2 ** n + random.random() * 0.1)"
    ),
  },
  {
    title: "Read a large file without loading it into memory",
    description: "Iterating a file object yields one line at a time, which is the difference between a constant footprint and an OOM.",
    language: "python", category: "Python", tags: "files,memory,io",
    code: lines(
      "with open('access.log', encoding='utf-8') as fh:",
      "    for line in fh:",
      "        if 'ERROR' in line:",
      "            print(line.rstrip())"
    ),
  },
  {
    title: "Chunk an iterable into fixed-size batches",
    description: "itertools.batched on 3.12 and later; the islice version works everywhere and never materialises the whole input.",
    language: "python", category: "Python", tags: "itertools,batching",
    code: lines(
      "from itertools import batched, islice",
      "",
      "for chunk in batched(rows, 500):",
      "    insert_many(chunk)",
      "",
      "# Before 3.12:",
      "def chunks(it, size):",
      "    it = iter(it)",
      "    while batch := list(islice(it, size)):",
      "        yield batch"
    ),
  },
  {
    title: "A dataclass with validation",
    description: "__post_init__ runs after the generated constructor, which is where cheap invariants belong.",
    language: "python", category: "Python", tags: "dataclasses,validation",
    code: lines(
      "from dataclasses import dataclass, field",
      "",
      "@dataclass(frozen=True, slots=True)",
      "class Money:",
      "    amount: int",
      "    currency: str = 'GBP'",
      "",
      "    def __post_init__(self):",
      "        if self.amount < 0:",
      "            raise ValueError('amount cannot be negative')"
    ),
  },
  {
    title: "Time a block of code",
    description: "A context manager that prints how long its body took, without scattering time.perf_counter calls through the function.",
    language: "python", category: "Python", tags: "profiling,contextmanager",
    code: lines(
      "import time",
      "from contextlib import contextmanager",
      "",
      "@contextmanager",
      "def timed(label):",
      "    start = time.perf_counter()",
      "    try:",
      "        yield",
      "    finally:",
      "        print(f'{label}: {time.perf_counter() - start:.3f}s')",
      "",
      "with timed('import'):",
      "    load_everything()"
    ),
  },
  {
    title: "Parse arguments without a dependency",
    description: "argparse covers subcommands, types and help text, which is more than most scripts ever need.",
    language: "python", category: "Python", tags: "cli,argparse",
    code: lines(
      "import argparse",
      "",
      "parser = argparse.ArgumentParser(description='Import a CSV export.')",
      "parser.add_argument('path', help='file to import')",
      "parser.add_argument('--batch', type=int, default=500)",
      "parser.add_argument('--dry-run', action='store_true')",
      "args = parser.parse_args()"
    ),
  },
  {
    title: "Merge dictionaries",
    description: "The | operator returns a new dict; |= updates in place. Later keys win in both.",
    language: "python", category: "Python", tags: "dicts,merging",
    code: lines(
      "merged = defaults | overrides",
      "",
      "settings = {}",
      "settings |= from_file",
      "settings |= from_env"
    ),
  },
  {
    title: "Walk a directory tree lazily",
    description: "pathlib keeps the paths as objects rather than strings, so joining and suffix checks stay readable.",
    language: "python", category: "Python", tags: "pathlib,files",
    code: lines(
      "from pathlib import Path",
      "",
      "for path in Path('src').rglob('*.py'):",
      "    if path.stat().st_size > 50_000:",
      "        print(path, path.stat().st_size)"
    ),
  },

  {
    title: "Narrow a union with a type guard",
    description: "A predicate returning `x is T` teaches the compiler what a runtime check proved.",
    language: "typescript", category: "TypeScript", tags: "types,narrowing",
    code: lines(
      "type Result<T> = { ok: true; value: T } | { ok: false; error: string };",
      "",
      "function isOk<T>(r: Result<T>): r is { ok: true; value: T } {",
      "  return r.ok;",
      "}",
      "",
      "if (isOk(result)) {",
      "  console.log(result.value); // narrowed",
      "}"
    ),
  },
  {
    title: "Make some properties optional",
    description: "Composes the built-in helpers rather than writing a second interface that will drift from the first.",
    language: "typescript", category: "TypeScript", tags: "types,utility-types",
    code: lines(
      "type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;",
      "",
      "type NewUser = PartialBy<User, 'id' | 'createdAt'>;"
    ),
  },
  {
    title: "Exhaustiveness check on a switch",
    description: "Assigning to never makes the compiler fail the build when a new union member is added and left unhandled.",
    language: "typescript", category: "TypeScript", tags: "types,switch,never",
    code: lines(
      "function area(shape: Shape): number {",
      "  switch (shape.kind) {",
      "    case 'circle': return Math.PI * shape.r ** 2;",
      "    case 'square': return shape.side ** 2;",
      "    default: {",
      "      const _exhaustive: never = shape;",
      "      throw new Error(`unhandled: ${_exhaustive}`);",
      "    }",
      "  }",
      "}"
    ),
  },
  {
    title: "Type a fetch response safely",
    description: "unknown forces a parse step rather than letting an any spread silently through the codebase.",
    language: "typescript", category: "TypeScript", tags: "types,http,parsing",
    code: lines(
      "async function getJson<T>(url: string, parse: (u: unknown) => T): Promise<T> {",
      "  const res = await fetch(url);",
      "  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);",
      "  return parse(await res.json());",
      "}"
    ),
  },
  {
    title: "Const assertion for a lookup table",
    description: "`as const` keeps the literal types, so the derived union is the actual keys rather than string.",
    language: "typescript", category: "TypeScript", tags: "types,const-assertion",
    code: lines(
      "const ROLES = ['admin', 'editor', 'viewer'] as const;",
      "type Role = (typeof ROLES)[number];   // 'admin' | 'editor' | 'viewer'"
    ),
  },

  {
    title: "Centre a box, two ways",
    description: "Grid is one line. Flex is three and gives you control over the axes separately.",
    language: "css", category: "Web & CSS", tags: "layout,centring,flexbox,grid",
    code: lines(
      ".centre-grid {",
      "  display: grid;",
      "  place-items: center;",
      "}",
      "",
      ".centre-flex {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "}"
    ),
  },
  {
    title: "Responsive grid without media queries",
    description: "auto-fill with minmax reflows on its own, so the column count follows the container rather than a breakpoint list.",
    language: "css", category: "Web & CSS", tags: "grid,responsive,layout",
    code: lines(
      ".cards {",
      "  display: grid;",
      "  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));",
      "  gap: 1rem;",
      "}"
    ),
  },
  {
    title: "Truncate text to a number of lines",
    description: "Ellipsis after two lines. The -webkit- prefixes are still required despite being supported everywhere.",
    language: "css", category: "Web & CSS", tags: "text,truncation",
    code: lines(
      ".clamp-2 {",
      "  display: -webkit-box;",
      "  -webkit-line-clamp: 2;",
      "  -webkit-box-orient: vertical;",
      "  overflow: hidden;",
      "}"
    ),
  },
  {
    title: "Respect a reduced-motion preference",
    description: "One rule that disables animation for people who asked their system for less of it.",
    language: "css", category: "Web & CSS", tags: "accessibility,motion",
    code: lines(
      "@media (prefers-reduced-motion: reduce) {",
      "  *, *::before, *::after {",
      "    animation-duration: 0.01ms !important;",
      "    animation-iteration-count: 1 !important;",
      "    transition-duration: 0.01ms !important;",
      "    scroll-behavior: auto !important;",
      "  }",
      "}"
    ),
  },
  {
    title: "Visually hidden, still read aloud",
    description: "Hides a label from sight while leaving it in the accessibility tree. display:none would remove it from both.",
    language: "css", category: "Web & CSS", tags: "accessibility,screen-readers",
    code: lines(
      ".sr-only {",
      "  position: absolute;",
      "  width: 1px;",
      "  height: 1px;",
      "  padding: 0;",
      "  margin: -1px;",
      "  overflow: hidden;",
      "  clip-path: inset(50%);",
      "  white-space: nowrap;",
      "  border: 0;",
      "}"
    ),
  },
  {
    title: "A semantic, accessible form field",
    description: "The label is tied to the input by id, and the hint is announced with it via aria-describedby.",
    language: "html", category: "Web & CSS", tags: "forms,accessibility,html",
    code: lines(
      '<div class="field">',
      '  <label for="email">Email address</label>',
      '  <input id="email" name="email" type="email"',
      '         autocomplete="email" required',
      '         aria-describedby="email-hint" />',
      '  <p id="email-hint">We only use this to send receipts.</p>',
      "</div>"
    ),
  },
  {
    title: "Responsive images that do not blow the bandwidth budget",
    description: "srcset lets the browser pick; sizes tells it how wide the image will actually be rendered.",
    language: "html", category: "Web & CSS", tags: "images,performance,responsive",
    code: lines(
      "<img",
      '  src="photo-800.jpg"',
      '  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"',
      '  sizes="(max-width: 700px) 100vw, 700px"',
      '  width="800" height="600"',
      '  loading="lazy" decoding="async"',
      '  alt="A harbour at low tide" />'
    ),
  },
  {
    title: "Read a file into a string in Go",
    description: "os.ReadFile replaced ioutil.ReadFile in 1.16 and is the one-liner for small files.",
    language: "go", category: "Systems", tags: "go,files,io",
    code: lines(
      "data, err := os.ReadFile(\"config.yaml\")",
      "if err != nil {",
      "    return fmt.Errorf(\"reading config: %w\", err)",
      "}",
      "fmt.Println(string(data))"
    ),
  },
  {
    title: "Worker pool with a wait group in Go",
    description: "Fixed number of goroutines draining a channel, with the group ensuring main waits for all of them.",
    language: "go", category: "Systems", tags: "go,concurrency,goroutines",
    code: lines(
      "jobs := make(chan Job)",
      "var wg sync.WaitGroup",
      "",
      "for i := 0; i < runtime.NumCPU(); i++ {",
      "    wg.Add(1)",
      "    go func() {",
      "        defer wg.Done()",
      "        for j := range jobs {",
      "            process(j)",
      "        }",
      "    }()",
      "}",
      "",
      "for _, j := range allJobs {",
      "    jobs <- j",
      "}",
      "close(jobs)",
      "wg.Wait()"
    ),
  },
  {
    title: "Context with a timeout in Go",
    description: "Cancels the request and everything downstream of it after two seconds. The defer is not optional.",
    language: "go", category: "Systems", tags: "go,context,timeout",
    code: lines(
      "ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)",
      "defer cancel()",
      "",
      "req, _ := http.NewRequestWithContext(ctx, \"GET\", url, nil)",
      "resp, err := http.DefaultClient.Do(req)"
    ),
  },
  {
    title: "Result and the question mark operator in Rust",
    description: "? propagates the error to the caller, which is why Rust functions rarely need explicit error branches.",
    language: "rust", category: "Systems", tags: "rust,errors,result",
    code: lines(
      "use std::fs;",
      "",
      "fn read_config(path: &str) -> Result<Config, Box<dyn std::error::Error>> {",
      "    let text = fs::read_to_string(path)?;",
      "    let config: Config = toml::from_str(&text)?;",
      "    Ok(config)",
      "}"
    ),
  },
  {
    title: "Iterate and collect in Rust",
    description: "Filter and map fuse into a single pass; collect decides what comes out the other end.",
    language: "rust", category: "Systems", tags: "rust,iterators",
    code: lines(
      "let names: Vec<String> = users",
      "    .iter()",
      "    .filter(|u| u.active)",
      "    .map(|u| u.name.to_uppercase())",
      "    .collect();"
    ),
  },
  {
    title: "RAII file handling in C++",
    description: "The stream closes itself when it leaves scope, whether the function returns normally or throws.",
    language: "cpp", category: "Systems", tags: "cpp,raii,files",
    code: lines(
      "#include <fstream>",
      "#include <string>",
      "",
      "std::string read_all(const std::string& path) {",
      "    std::ifstream in(path, std::ios::binary);",
      "    if (!in) throw std::runtime_error(\"cannot open \" + path);",
      "    return std::string(std::istreambuf_iterator<char>(in), {});",
      "}"
    ),
  },
  {
    title: "Check a malloc result in C",
    description: "The allocation that nobody checks is the one that fails in production.",
    language: "c", category: "Systems", tags: "c,memory,errors",
    code: lines(
      "char *buf = malloc(len + 1);",
      "if (buf == NULL) {",
      "    fprintf(stderr, \"out of memory allocating %zu bytes\\n\", len + 1);",
      "    return -1;",
      "}",
      "memcpy(buf, src, len);",
      "buf[len] = '\\0';"
    ),
  },
  {
    title: "Records and pattern matching in Java",
    description: "A record plus a switch pattern removes most of the ceremony this used to take.",
    language: "java", category: "Systems", tags: "java,records,pattern-matching",
    code: lines(
      "sealed interface Shape permits Circle, Square {}",
      "record Circle(double r) implements Shape {}",
      "record Square(double side) implements Shape {}",
      "",
      "double area(Shape s) {",
      "    return switch (s) {",
      "        case Circle c -> Math.PI * c.r() * c.r();",
      "        case Square q -> q.side() * q.side();",
      "    };",
      "}"
    ),
  },
  {
    title: "Null-safe chaining in Kotlin",
    description: "?. stops at the first null and ?: supplies the fallback, replacing a stack of if statements.",
    language: "kotlin", category: "Systems", tags: "kotlin,null-safety",
    code: lines(
      "val city = user?.address?.city ?: \"unknown\"",
      "",
      "user?.address?.let { addr ->",
      "    println(\"${addr.street}, ${addr.city}\")",
      "}"
    ),
  },
  {
    title: "Async/await with a task group in Swift",
    description: "Runs the downloads concurrently and collects them, with cancellation propagating to all of them.",
    language: "swift", category: "Systems", tags: "swift,concurrency,async",
    code: lines(
      "func loadAll(_ urls: [URL]) async throws -> [Data] {",
      "    try await withThrowingTaskGroup(of: Data.self) { group in",
      "        for url in urls {",
      "            group.addTask { try await URLSession.shared.data(from: url).0 }",
      "        }",
      "        var results: [Data] = []",
      "        for try await data in group { results.append(data) }",
      "        return results",
      "    }",
      "}"
    ),
  },
  {
    title: "Nullable reference types in C#",
    description: "Turning the feature on makes the compiler point at every place a null could slip through.",
    language: "csharp", category: "Systems", tags: "csharp,null-safety",
    code: lines(
      "#nullable enable",
      "",
      "public string Describe(User? user) =>",
      "    user?.Name ?? \"anonymous\";",
      "",
      "// In the .csproj, for the whole project:",
      "// <Nullable>enable</Nullable>"
    ),
  },

  {
    title: "Prepared statement with PDO",
    description: "Placeholders rather than interpolation. This is the whole of SQL injection defence in PHP.",
    language: "php", category: "PHP", tags: "php,pdo,security,sql",
    code: lines(
      "$stmt = $pdo->prepare(",
      "    'SELECT id, title FROM posts WHERE author_id = ? AND published = ?'",
      ");",
      "$stmt->execute([$authorId, 1]);",
      "$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);"
    ),
  },
  {
    title: "Escape output in a PHP template",
    description: "htmlspecialchars with the flags spelled out, because the defaults have changed between versions.",
    language: "php", category: "PHP", tags: "php,security,xss,templates",
    code: lines(
      "<?php",
      "function e(?string $value): string {",
      "    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');",
      "}",
      "?>",
      "<p><?= e($comment) ?></p>"
    ),
  },
  {
    title: "Hash and verify a password in PHP",
    description: "password_hash picks the algorithm and the salt. Never store anything a hash function can reverse.",
    language: "php", category: "PHP", tags: "php,security,passwords",
    code: lines(
      "$hash = password_hash($plain, PASSWORD_DEFAULT);",
      "",
      "if (password_verify($submitted, $hash)) {",
      "    if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {",
      "        $hash = password_hash($submitted, PASSWORD_DEFAULT);",
      "    }",
      "}"
    ),
  },

  {
    title: "Group and count in Ruby",
    description: "tally does the counting; group_by keeps the members when you need them.",
    language: "ruby", category: "Ruby", tags: "ruby,enumerable",
    code: lines(
      "words.tally",
      "#=> {\"the\"=>12, \"and\"=>7}",
      "",
      "orders.group_by(&:status)",
      "      .transform_values(&:count)"
    ),
  },
  {
    title: "Safe navigation and fetch in Ruby",
    description: "&. stops at nil; fetch raises rather than returning nil when a key is genuinely required.",
    language: "ruby", category: "Ruby", tags: "ruby,nil-safety,hashes",
    code: lines(
      "city = user&.address&.city || 'unknown'",
      "",
      "port = config.fetch('port')          # raises if absent",
      "host = config.fetch('host', 'localhost')"
    ),
  },
  {
    title: "Inspect a TLS certificate from the command line",
    description: "Prints the subject, issuer and validity dates without opening a browser.",
    language: "bash", category: "Networking", tags: "tls,openssl,certificates",
    code: lines(
      "echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null \\",
      "  | openssl x509 -noout -subject -issuer -dates"
    ),
  },
  {
    title: "Time every phase of an HTTP request",
    description: "Splits DNS, connect, TLS and first byte apart, which tells you which one is actually slow.",
    language: "bash", category: "Networking", tags: "curl,performance,http",
    code: lines(
      "curl -w '\\n dns: %{time_namelookup}s\\n connect: %{time_connect}s\\n tls: %{time_appconnect}s\\n ttfb: %{time_starttransfer}s\\n total: %{time_total}s\\n' \\",
      "  -o /dev/null -s https://example.com"
    ),
  },
  {
    title: "Follow redirects and show only the headers",
    description: "Traces a redirect chain to its destination without downloading the body.",
    language: "bash", category: "Networking", tags: "curl,http,redirects",
    code: lines(
      "curl -sIL https://example.com | grep -E '^(HTTP|location)'"
    ),
  },
  {
    title: "Which DNS records does a domain have?",
    description: "dig with +short strips everything but the answer.",
    language: "bash", category: "Networking", tags: "dns,dig",
    code: lines(
      "dig +short A example.com",
      "dig +short MX example.com",
      "dig +short TXT example.com",
      "",
      "# Bypass the local resolver:",
      "dig @1.1.1.1 +short A example.com"
    ),
  },
  {
    title: "Open an SSH tunnel to a remote database",
    description: "Forwards a local port through a bastion so a client can connect as if the database were local.",
    language: "bash", category: "Networking", tags: "ssh,tunnel,postgres",
    code: lines(
      "ssh -N -L 5433:db.internal:5432 bastion.example.com",
      "",
      "# Then, in another shell:",
      "psql -h localhost -p 5433 -U app mydb"
    ),
  },

  {
    title: "Sum a column with awk",
    description: "Adds the third field of every line and prints the total, ignoring anything non-numeric.",
    language: "bash", category: "Text Processing", tags: "awk,csv,sums",
    code: lines(
      "awk -F',' '{ total += $3 } END { print total }' sales.csv",
      "",
      "# Skipping a header row:",
      "awk -F',' 'NR > 1 { total += $3 } END { printf \"%.2f\\n\", total }' sales.csv"
    ),
  },
  {
    title: "Replace text across a whole project",
    description: "ripgrep finds the files, sed edits them in place. The dry run first is not optional.",
    language: "bash", category: "Text Processing", tags: "sed,ripgrep,refactoring",
    code: lines(
      "rg -l 'oldFunctionName'",
      "",
      "rg -l 'oldFunctionName' | xargs sed -i 's/oldFunctionName/newFunctionName/g'"
    ),
  },
  {
    title: "Pretty-print and query JSON",
    description: "jq for the common cases: reformat, pick a path, filter an array, and reshape.",
    language: "bash", category: "Text Processing", tags: "jq,json",
    code: lines(
      "jq . response.json",
      "jq -r '.items[].name' response.json",
      "jq '[.items[] | select(.active)] | length' response.json",
      "jq '{ id, name: .title }' response.json"
    ),
  },
  {
    title: "Sort and deduplicate lines by a field",
    description: "Sorts on the second column and keeps the first row of each group.",
    language: "bash", category: "Text Processing", tags: "sort,uniq,fields",
    code: lines(
      "sort -t',' -k2,2 -u contacts.csv",
      "",
      "# Count duplicates instead of removing them:",
      "cut -d',' -f2 contacts.csv | sort | uniq -c | sort -rn"
    ),
  },
  {
    title: "Extract matches with a regular expression",
    description: "grep -o prints only the matching part, which turns grep into a crude extractor.",
    language: "bash", category: "Text Processing", tags: "grep,regex,extraction",
    code: lines(
      "grep -oE '[0-9]{1,3}(\\.[0-9]{1,3}){3}' access.log | sort -u",
      "",
      "# Every email address in a directory:",
      "grep -rhoE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' . | sort -u"
    ),
  },
  {
    title: "A regular expression for ISO 8601 dates",
    description: "Matches a date, optionally with a time and a zone. Deliberately strict about separators.",
    language: "plaintext", category: "Text Processing", tags: "regex,dates,validation",
    code: lines(
      "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])",
      "(?:T([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?",
      "(?:Z|[+-](?:[01]\\d|2[0-3]):[0-5]\\d))?$"
    ),
  },
  {
    title: "Rewrite a CSV column with perl",
    description: "A one-liner that upper-cases the second field of every row, leaving the rest alone.",
    language: "perl", category: "Text Processing", tags: "perl,csv,one-liner",
    code: lines(
      "perl -F',' -lane '$F[1] = uc $F[1]; print join \",\", @F' contacts.csv"
    ),
  },

  {
    title: "Find the largest files with PowerShell",
    description: "The Windows counterpart to du | sort | head.",
    language: "powershell", category: "Shell", tags: "powershell,windows,disk",
    code: lines(
      "Get-ChildItem -Recurse -File |",
      "  Sort-Object Length -Descending |",
      "  Select-Object -First 20 FullName, @{N='MB';E={[math]::Round($_.Length/1MB,1)}}"
    ),
  },
  {
    title: "Call a JSON API from PowerShell",
    description: "Invoke-RestMethod parses the response for you, so no ConvertFrom-Json step is needed.",
    language: "powershell", category: "Networking", tags: "powershell,http,json",
    code: lines(
      "$headers = @{ Authorization = \"Bearer $token\" }",
      "$body = @{ name = 'example' } | ConvertTo-Json",
      "",
      "Invoke-RestMethod -Uri 'https://api.example.com/items' `",
      "  -Method Post -Headers $headers -ContentType 'application/json' -Body $body"
    ),
  },

  {
    title: "YAML anchors to avoid repeating yourself",
    description: "Define a block once, merge it into each service. Changing the base changes all of them.",
    language: "yaml", category: "Data Formats", tags: "yaml,anchors,compose",
    code: lines(
      "x-defaults: &defaults",
      "  restart: unless-stopped",
      "  logging:",
      "    driver: json-file",
      "    options:",
      "      max-size: 10m",
      "",
      "services:",
      "  api:",
      "    <<: *defaults",
      "    image: example/api:1.4.0",
      "  worker:",
      "    <<: *defaults",
      "    image: example/worker:1.4.0"
    ),
  },
  {
    title: "A minimal JSON Schema",
    description: "Describes the shape of a payload so it can be validated before anything else touches it.",
    language: "json", category: "Data Formats", tags: "json,schema,validation",
    code: lines(
      "{",
      '  "$schema": "https://json-schema.org/draft/2020-12/schema",',
      '  "type": "object",',
      '  "required": ["id", "email"],',
      '  "additionalProperties": false,',
      '  "properties": {',
      '    "id": { "type": "integer", "minimum": 1 },',
      '    "email": { "type": "string", "format": "email" },',
      '    "tags": { "type": "array", "items": { "type": "string" } }',
      "  }",
      "}"
    ),
  },
  {
    title: "An RSS feed skeleton",
    description: "The minimum a reader needs. Dates must be RFC 822, which is the part most generators get wrong.",
    language: "xml", category: "Data Formats", tags: "xml,rss,feeds",
    code: lines(
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0">',
      "  <channel>",
      "    <title>Example Notes</title>",
      "    <link>https://example.com/</link>",
      "    <description>Occasional writing.</description>",
      "    <item>",
      "      <title>A first post</title>",
      "      <link>https://example.com/first-post</link>",
      "      <guid isPermaLink=\"true\">https://example.com/first-post</guid>",
      "      <pubDate>Mon, 14 Sep 2026 09:00:00 +0000</pubDate>",
      "    </item>",
      "  </channel>",
      "</rss>"
    ),
  },
  {
    title: "A README that people actually read",
    description: "The order matters more than the length: what it is, how to run it, how to develop on it.",
    language: "markdown", category: "Data Formats", tags: "markdown,docs,readme",
    code: lines(
      "# Project name",
      "",
      "One sentence on what this does and who it is for.",
      "",
      "## Running it",
      "",
      "```bash",
      "cp .env.example .env",
      "npm install",
      "npm start",
      "```",
      "",
      "## Developing",
      "",
      "| Command | What it does |",
      "| --- | --- |",
      "| `npm start` | Build the CSS and run the server |",
      "| `npm run watch:css` | Rebuild the stylesheet on change |"
    ),
  },
  {
    title: "Generate a strong random secret",
    description: "For session keys and tokens. Never reach for a password generator or a UUID for this.",
    language: "bash", category: "Security", tags: "secrets,openssl,random",
    code: lines(
      "openssl rand -base64 48",
      "",
      "# Hex, and without the base64 padding characters:",
      "openssl rand -hex 32",
      "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    ),
  },
  {
    title: "Compare secrets in constant time",
    description: "A plain === leaks how much of the token matched through its timing. This does not.",
    language: "javascript", category: "Security", tags: "security,timing,crypto",
    code: lines(
      "const { timingSafeEqual } = require('node:crypto');",
      "",
      "function safeEqual(a, b) {",
      "  const ba = Buffer.from(a);",
      "  const bb = Buffer.from(b);",
      "  if (ba.length !== bb.length) return false;",
      "  return timingSafeEqual(ba, bb);",
      "}"
    ),
  },
  {
    title: "A starting Content-Security-Policy",
    description: "Blocks inline script and restricts everything to the origin. Tighten from here rather than loosening from nothing.",
    language: "plaintext", category: "Security", tags: "csp,headers,web",
    code: lines(
      "Content-Security-Policy:",
      "  default-src 'self';",
      "  script-src 'self';",
      "  style-src 'self';",
      "  img-src 'self' data:;",
      "  object-src 'none';",
      "  base-uri 'self';",
      "  frame-ancestors 'none'"
    ),
  },
  {
    title: "Generate an SSH key and add it to the agent",
    description: "Ed25519 rather than RSA: shorter, faster, and no key-size decision to get wrong.",
    language: "bash", category: "Security", tags: "ssh,keys",
    code: lines(
      "ssh-keygen -t ed25519 -C 'you@example.com' -f ~/.ssh/id_ed25519",
      "eval \"$(ssh-agent -s)\"",
      "ssh-add ~/.ssh/id_ed25519",
      "cat ~/.ssh/id_ed25519.pub"
    ),
  },
  {
    title: "Check a file's checksum",
    description: "Verifies a download actually matches what the publisher signed, rather than trusting the transfer.",
    language: "bash", category: "Security", tags: "checksums,verification",
    code: lines(
      "sha256sum -c release.tar.gz.sha256",
      "",
      "# Comparing by hand:",
      "sha256sum release.tar.gz",
      "echo 'expected-hash-here  release.tar.gz' | sha256sum -c -"
    ),
  },
  {
    title: "Security headers for an Express app",
    description: "The handful worth setting even when you are not using a framework that sets them for you.",
    language: "javascript", category: "Security", tags: "express,headers,web",
    code: lines(
      "app.use((req, res, next) => {",
      "  res.setHeader('X-Content-Type-Options', 'nosniff');",
      "  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');",
      "  res.setHeader('X-Frame-Options', 'DENY');",
      "  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');",
      "  next();",
      "});"
    ),
  },

  {
    title: "A test that fails for the right reason",
    description: "Assert on the message, not merely that something threw. A typo raising TypeError would otherwise pass.",
    language: "javascript", category: "Testing", tags: "testing,assertions,node",
    code: lines(
      "import { test } from 'node:test';",
      "import assert from 'node:assert/strict';",
      "",
      "test('rejects a negative amount', () => {",
      "  assert.throws(",
      "    () => new Money(-1),",
      "    { name: 'RangeError', message: /cannot be negative/ }",
      "  );",
      "});"
    ),
  },
  {
    title: "Freeze time in a test",
    description: "Node's mock timers make anything date-dependent deterministic without injecting a clock everywhere.",
    language: "javascript", category: "Testing", tags: "testing,time,mocking",
    code: lines(
      "import { mock, test } from 'node:test';",
      "",
      "test('expires after an hour', (t) => {",
      "  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-01-01T00:00:00Z') });",
      "  const token = issueToken();",
      "  t.mock.timers.tick(61 * 60 * 1000);",
      "  assert.equal(isValid(token), false);",
      "});"
    ),
  },
  {
    title: "Parameterised tests in Python",
    description: "One test body, many cases, and a failure that names the case that broke.",
    language: "python", category: "Testing", tags: "testing,pytest,parametrize",
    code: lines(
      "import pytest",
      "",
      "@pytest.mark.parametrize('raw,expected', [",
      "    ('1',    1),",
      "    ('  2 ', 2),",
      "    ('0',    None),",
      "    ('abc',  None),",
      "])",
      "def test_parse_page(raw, expected):",
      "    assert parse_page(raw) == expected"
    ),
  },
  {
    title: "Table-driven tests in Go",
    description: "The idiomatic Go pattern: a slice of cases and a subtest per entry, each named so failures are readable.",
    language: "go", category: "Testing", tags: "testing,go,table-driven",
    code: lines(
      "func TestSlugify(t *testing.T) {",
      "    cases := []struct{ name, in, want string }{",
      "        {\"spaces\", \"Hello World\", \"hello-world\"},",
      "        {\"punctuation\", \"A/B?\", \"a-b\"},",
      "        {\"already clean\", \"ok\", \"ok\"},",
      "    }",
      "    for _, c := range cases {",
      "        t.Run(c.name, func(t *testing.T) {",
      "            if got := Slugify(c.in); got != c.want {",
      "                t.Errorf(\"got %q, want %q\", got, c.want)",
      "            }",
      "        })",
      "    }",
      "}"
    ),
  },

  {
    title: "A GitHub Actions workflow for a Node project",
    description: "Caches the dependency install, runs on a matrix of versions, and fails the build on a lint error.",
    language: "yaml", category: "Build & CI", tags: "ci,github-actions,node",
    code: lines(
      "name: CI",
      "on:",
      "  push: { branches: [main] }",
      "  pull_request:",
      "",
      "jobs:",
      "  test:",
      "    runs-on: ubuntu-latest",
      "    strategy:",
      "      matrix:",
      "        node: [20, 22]",
      "    steps:",
      "      - uses: actions/checkout@v4",
      "      - uses: actions/setup-node@v4",
      "        with:",
      "          node-version: ${{ matrix.node }}",
      "          cache: npm",
      "      - run: npm ci",
      "      - run: npm run lint",
      "      - run: npm test"
    ),
  },
  {
    title: "A Makefile that documents itself",
    description: "Running make with no arguments prints every target that carries a comment.",
    language: "plaintext", category: "Build & CI", tags: "make,tooling,docs",
    code: lines(
      ".DEFAULT_GOAL := help",
      "",
      "help:  ## Show this help",
      "\t@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \\",
      "\t  | awk 'BEGIN {FS = \":.*?## \"}; {printf \"  %-14s %s\\n\", $$1, $$2}'",
      "",
      "build:  ## Compile the assets",
      "\tnpm run build",
      "",
      "test:  ## Run the test suite",
      "\tnpm test",
      "",
      ".PHONY: help build test"
    ),
  },
  {
    title: "Cache busting with a content hash",
    description: "Names the built file after its contents so a deploy invalidates the cache without a version bump.",
    language: "javascript", category: "Build & CI", tags: "build,caching,hashing",
    code: lines(
      "import { createHash } from 'node:crypto';",
      "import { readFileSync, renameSync } from 'node:fs';",
      "",
      "const css = readFileSync('dist/app.css');",
      "const hash = createHash('sha256').update(css).digest('hex').slice(0, 8);",
      "renameSync('dist/app.css', `dist/app.${hash}.css`);",
      "console.log(`app.${hash}.css`);"
    ),
  },
  {
    title: "Pin a dependency to an exact version",
    description: "Caret ranges are how a build that passed last week fails today. Exact versions plus a lockfile remove the surprise.",
    language: "bash", category: "Build & CI", tags: "npm,dependencies,reproducibility",
    code: lines(
      "npm install --save-exact express@5.1.0",
      "",
      "# Make it the default for this project:",
      "npm config set save-exact true --location project",
      "",
      "# Install exactly what the lockfile says, nothing newer:",
      "npm ci"
    ),
  },

  {
    title: "Internal deploy runbook",
    description: "Private: the order of operations for a production release, including who to tell and when.",
    language: "markdown", category: "Build & CI", tags: "runbook,deploy,internal",
    private: true,
    code: lines(
      "# Release runbook",
      "",
      "1. Confirm CI is green on `main`.",
      "2. Announce in #releases, expect ten minutes.",
      "3. `make deploy ENV=production`",
      "4. Watch the error rate for five minutes.",
      "5. If it climbs, `make rollback` -- do not debug forward."
    ),
  },
  {
    title: "Staging environment variables",
    description: "Private: the shape of the staging .env, with the values themselves left out.",
    language: "plaintext", category: "Build & CI", tags: "config,internal,env",
    private: true,
    code: lines(
      "NODE_ENV=staging",
      "PORT=3000",
      "DATABASE_URL=postgres://app@db.staging.internal:5432/app",
      "SESSION_SECRET=<from the password manager>",
      "LOG_LEVEL=debug"
    ),
  },
];
