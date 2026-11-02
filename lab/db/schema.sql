-- Lab schema. Mirrors a typical Supabase app: auth users plus public tables.
-- "users" stands for auth.users and is never exposed through the REST API.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE profiles (
  id TEXT PRIMARY KEY REFERENCES users(id),
  display_name TEXT NOT NULL,
  phone TEXT,
  is_admin INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  is_listed INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  ship_address TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE coupons (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL,
  percent_off INTEGER NOT NULL
);
