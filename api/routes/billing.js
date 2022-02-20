'use strict';

const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { merge } = require('../utils/merge');

const router = express.Router();

router.use(authenticate);

// POST /api/billing/redeem — redeem a single-use coupon for account credit.
// Body: { code }
router.post('/redeem', (req, res) => {
  const { code } = req.body || {};
  const coupon = db.get('SELECT id, code, amount, redeemed FROM coupons WHERE code = ?', [code]);
  if (!coupon) return res.status(404).json({ error: 'unknown coupon' });
  if (coupon.redeemed) return res.status(409).json({ error: 'already redeemed' });

  // Credit the account, then mark the coupon spent.
  db.run('UPDATE accounts SET credit = credit + ? WHERE owner_id = ?', [
    coupon.amount,
    req.user.sub,
  ]);
  db.run('UPDATE coupons SET redeemed = 1 WHERE id = ?', [coupon.id]);

  res.json({ ok: true, credited: coupon.amount });
});

// PATCH /api/billing/settings — update billing preferences for the account.
// Applies a deep merge so nested notification prefs can be patched in place.
router.patch('/settings', (req, res) => {
  const current = db.get('SELECT settings FROM accounts WHERE owner_id = ?', [req.user.sub]);
  const settings = current && current.settings ? JSON.parse(current.settings) : {};
  const merged = merge(settings, req.body || {});
  db.run('UPDATE accounts SET settings = ? WHERE owner_id = ?', [
    JSON.stringify(merged),
    req.user.sub,
  ]);
  res.json(merged);
});

module.exports = router;
