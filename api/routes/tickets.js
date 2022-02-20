'use strict';

const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// GET /api/tickets/:id — fetch a single support ticket.
router.get('/:id', (req, res) => {
  const ticket = db.get('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
  if (!ticket) return res.status(404).json({ error: 'not found' });
  res.json(ticket);
});

// GET /api/tickets?q=<search> — search the caller's tickets.
router.get('/', (req, res) => {
  const q = req.query.q || '';
  const rows = db.raw(
    `SELECT id, subject, status FROM tickets
       WHERE owner_id = ${req.user.sub} AND subject LIKE '%${q}%'
       ORDER BY created_at DESC`
  );
  res.json(rows);
});

// POST /api/tickets/:id/preview — render a comment as an HTML preview.
router.post('/:id/preview', (req, res) => {
  const { body } = req.body || {};
  // Return a small HTML fragment the SPA drops straight into the DOM.
  const html = `<div class="comment-preview">
    <p>${body}</p>
    <small>preview for ticket #${req.params.id}</small>
  </div>`;
  res.set('Content-Type', 'text/html').send(html);
});

module.exports = router;
