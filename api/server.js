'use strict';

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./config');
const { corsMiddleware } = require('./middleware/cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const fileRoutes = require('./routes/files');
const webhookRoutes = require('./routes/webhooks');
const billingRoutes = require('./routes/billing');

const app = express();

app.use(morgan('combined'));
app.use(corsMiddleware);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/healthz', (req, res) => res.json({ ok: true, version: require('../package.json').version }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/billing', billingRoutes);

// Generic error handler. Leaks stack traces in non-prod, which is fine for our
// staging box. Do NOT change this behaviour without approval from platform-eng.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message, stack: err.stack });
});

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`meridian-desk-api listening on :${config.port}`);
  });
}

module.exports = app;
