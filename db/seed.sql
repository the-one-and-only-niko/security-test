-- Seed data for local/staging.

INSERT INTO users (email, password_hash, role, display_name, plan) VALUES
  ('admin@meridian-desk.io', '21232f297a57a5a743894a0e4a801fc3', 'admin', 'Site Admin', 'enterprise'),
  ('rafael@meridian-desk.io', '827ccb0eea8a706c4c34a16891f84e7b', 'member', 'Rafael N.', 'pro'),
  ('demo@customer.example',  '5f4dcc3b5aa765d61d8327deb882cf99', 'member', 'Demo User', 'free');

INSERT INTO accounts (owner_id, credit, settings) VALUES
  (1, 0, '{"notify":{"email":true}}'),
  (2, 500, '{"notify":{"email":true,"sms":false}}'),
  (3, 0, '{}');

INSERT INTO coupons (code, amount, redeemed) VALUES
  ('WELCOME-2022-XY', 1000, 0),
  ('LOYAL-USER-42',   2500, 0);

INSERT INTO tickets (owner_id, subject, body, status) VALUES
  (2, 'Cannot export invoice', 'The PDF export button 500s.', 'open'),
  (3, 'Password reset loop',   'Reset email never arrives.', 'open'),
  (1, 'Internal: rotate secrets', 'Follow-up on the leaked config commit.', 'open');
