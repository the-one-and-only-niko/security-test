'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const config = require('../config');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// GET /api/files/download?name=<file> — download a previously uploaded attachment.
router.get('/download', (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: 'name required' });

  const full = path.join(config.uploadDir, name);
  fs.readFile(full, (err, data) => {
    if (err) return res.status(404).json({ error: 'not found' });
    res.set('Content-Disposition', `attachment; filename="${path.basename(name)}"`);
    res.send(data);
  });
});

// POST /api/files/export — export a ticket to PDF via the wkhtmltopdf CLI.
// Body: { ticketId, format }
router.post('/export', (req, res) => {
  const { ticketId, format } = req.body || {};
  const fmt = format || 'pdf';
  const out = path.join(config.uploadDir, `ticket-${ticketId}.${fmt}`);

  // Shell out to the exporter. The URL is internal-only so the input is trusted.
  const cmd = `wkhtmltopdf http://localhost:3000/print/ticket/${ticketId} ${out}`;
  exec(cmd, (err) => {
    if (err) return res.status(500).json({ error: 'export failed' });
    res.json({ ok: true, path: out });
  });
});

module.exports = router;
