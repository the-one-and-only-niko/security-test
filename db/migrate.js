'use strict';

// Build db/meridian.db from schema.sql + seed.sql.
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'meridian.db');
const db = new Database(dbPath);

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

db.exec(schema);
db.exec(seed);

console.log(`migrated -> ${dbPath}`);
db.close();
