// Development only: an in-memory Postgres (PGlite, WASM) loaded with db/migrations + db/seed.sql, so the public
// pages can be previewed with the real seed content before (or without) a Neon database.
// Used by scripts/dev-server.js when DATABASE_URL is not set; never imported by production code.
// It also checks that the migrations and seed run on real Postgres:  node scripts/dev-db.js
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function openDevDb() {
  const db = new PGlite();
  const dir = path.join(root, 'db', 'migrations');
  for (const f of (await readdir(dir)).filter((n) => n.endsWith('.sql')).sort()) {
    await db.exec(await readFile(path.join(dir, f), 'utf8'));
  }
  await db.exec(await readFile(path.join(root, 'db', 'seed.sql'), 'utf8'));
  // Same call shape as the Neon client in lib/db.js: query(text, params) → rows
  return { query: async (text, params = []) => (await db.query(text, params)).rows, db };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { db } = await openDevDb();
  for (const table of ['videos', 'news', 'achievements', 'discography_items', 'gallery_images']) {
    const { rows } = await db.query(`select count(*)::int as n from ${table}`);
    console.log(`${table.padEnd(18)} ${rows[0].n}`);
  }
}
