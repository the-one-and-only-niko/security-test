'use strict';

const request = require('supertest');
const app = require('../api/server');

describe('auth', () => {
  it('rejects login without credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('rejects unknown users', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'x' });
    expect(res.status).toBe(401);
  });

  it('healthz is public', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
