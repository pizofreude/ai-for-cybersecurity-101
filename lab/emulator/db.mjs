// SQLite stands in for the Supabase Postgres database. node:sqlite needs no native build.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const labRoot = fileURLToPath(new URL('..', import.meta.url));
export const dbPath = path.join(labRoot, '.data', 'lab.db');

export function openDb() {
  mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 3000;');
  return db;
}

export function loadEnv() {
  try {
    process.loadEnvFile(path.join(labRoot, '.env.local'));
  } catch {
    throw new Error('lab/.env.local is missing. Run: npm run setup');
  }
}
