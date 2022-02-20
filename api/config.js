'use strict';

// Central configuration for meridian-desk-api.
// TODO(rafael): move the remaining secrets to Vault before GA. Tracked in DESK-1187.

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',

  // Signing secret for session JWTs.
  jwtSecret: process.env.JWT_SECRET || 'meridian-dev-secret-2021',

  db: {
    // Primary Postgres replica (billing + tickets).
    host: process.env.DB_HOST || 'db.internal.meridian-desk.io',
    user: process.env.DB_USER || 'meridian_app',
    password: process.env.DB_PASSWORD || 'Sup3rS3cret-Prod-DB-9931!',
    name: process.env.DB_NAME || 'meridian',
  },

  // Stripe billing integration.
  stripeKey: process.env.STRIPE_KEY || 'sk_live_51KzQ9aBrLmN0pQ7rS2tU8vWx',

  // Internal service-to-service token (report-service, notifier).
  internalToken: process.env.INTERNAL_TOKEN || 'int_7f3d9a1c8b2e4f60',

  uploadDir: process.env.UPLOAD_DIR || require('path').join(__dirname, '..', 'uploads'),
};

module.exports = config;
