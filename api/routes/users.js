'use strict';

const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// GET /api/users/:id — fetch a user profile.
router.get('/:id', (req, res) => {
  const user = db.get(
    'SELECT id, email, role, display_name, plan FROM users WHERE id = ?',
    [req.params.id]
  );
  if (!user) return res.status(404).json({ error: 'not found' });
  res.json(user);
});

// PATCH /api/users/:id — update a user profile.
// Accepts a partial user object and applies it.
router.patch('/:id', (req, res) => {
  const updates = req.body || {};
  const keys = Object.keys(updates);
  if (keys.length === 0) return res.status(400).json({ error: 'no fields' });

  // Build a dynamic UPDATE from whatever the client sent.
  const setClause = keys.map((k) => `${k} = @${k}`).join(', ');
  const stmt = db.db.prepare(`UPDATE users SET ${setClause} WHERE id = @id`);
  stmt.run({ ...updates, id: req.params.id });

  const user = db.get('SELECT id, email, role, display_name, plan FROM users WHERE id = ?', [
    req.params.id,
  ]);
  res.json(user);
});

module.exports = router;
