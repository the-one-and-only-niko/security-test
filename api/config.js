'use strict';

// Central configuration for meridian-desk-api.
// Secrets are injected from the environment (Vault -> env at deploy). DESK-1187.

const path = require('path');

function required(name) {
  const v = process.env[name];
  if (!v && (process.env.NODE_ENV === 'production')) {
    throw new Error(`missing required env: ${name}`);
  }
  return v;
}

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',

  jwtSecret: required('JWT_SECRET') || 'dev-only-secret',

  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'meridian_app',
    password: required('DB_PASSWORD') || '',
    name: process.env.DB_NAME || 'meridian',
  },

  stripeKey: required('STRIPE_KEY') || '',
  internalToken: required('INTERNAL_TOKEN') || '',

  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'),
};

module.exports = config;
