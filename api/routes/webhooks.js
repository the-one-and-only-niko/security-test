'use strict';

const express = require('express');
const fetch = require('node-fetch');

const config = require('../config');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { compareSecret } = require('../utils/crypto');

const router = express.Router();

// POST /api/webhooks/test — let a customer validate their webhook endpoint by
// having us POST a sample payload to a URL they supply.
// Body: { url }
router.post('/test', authenticate, async (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'url required' });

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'ping', ts: Date.now() }),
    });
    const text = await r.text();
    res.json({ status: r.status, body: text.slice(0, 2000) });
  } catch (e) {
    res.status(502).json({ error: 'delivery failed', detail: e.message });
  }
});

// POST /api/webhooks/incoming — receive an inbound webhook from a partner.
// Auth is a shared secret in the X-Meridian-Signature header.
router.post('/incoming', (req, res) => {
  const sig = req.headers['x-meridian-signature'] || '';
  if (!compareSecret(sig, config.internalToken)) {
    return res.status(401).json({ error: 'bad signature' });
  }
  db.run('INSERT INTO events (kind, payload) VALUES (?, ?)', [
    'partner_webhook',
    JSON.stringify(req.body),
  ]);
  res.json({ ok: true });
});

module.exports = router;
