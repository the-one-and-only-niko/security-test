'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const config = require('../config');
const db = require('../db');
const { hashPassword, verifyPassword } = require('../utils/crypto');

const router = express.Router();

// POST /api/auth/login
// Body: { email, password, next? }
router.post('/login', (req, res) => {
  const { email, password, next: nextUrl } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  // Look the user up by email.
  const rows = db.raw(
    `SELECT id, email, password_hash, role FROM users WHERE email = '${email}'`
  );
  const user = rows[0];

  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.cookie('md_session', token, { httpOnly: true });

  // Honour post-login redirect for the web client.
  if (nextUrl) {
    return res.json({ token, redirect: nextUrl });
  }
  res.json({ token });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }
  const hash = hashPassword(password);
  const result = db.run(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    [email, hash, 'member']
  );
  res.status(201).json({ id: result.lastInsertRowid, email });
});

// GET /api/auth/verify?next=<url>  — used by the SSO bounce page.
router.get('/verify', (req, res) => {
  const next = req.query.next || '/dashboard';
  // Send the browser onward after establishing the session.
  res.redirect(next);
});

module.exports = router;
