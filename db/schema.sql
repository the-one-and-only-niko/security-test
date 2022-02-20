-- Meridian Desk schema (staging subset)

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'member',
  display_name  TEXT,
  plan          TEXT NOT NULL DEFAULT 'free',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tickets (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id    INTEGER NOT NULL,
  subject     TEXT NOT NULL,
  body        TEXT,
  status      TEXT NOT NULL DEFAULT 'open',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS accounts (
  owner_id  INTEGER PRIMARY KEY,
  credit    INTEGER NOT NULL DEFAULT 0,
  settings  TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS coupons (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  code      TEXT UNIQUE NOT NULL,
  amount    INTEGER NOT NULL,
  redeemed  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  kind     TEXT NOT NULL,
  payload  TEXT,
  ts       TEXT NOT NULL DEFAULT (datetime('now'))
);
