/* eslint-disable global-require */
/* eslint-disable no-undef */
const request = require('supertest');

let server;

describe('api/v1/', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
  });

  describe('GET /unknown-route', () => {
    it('should return 404 if an unknown route is visited', async () => {
      const res = await request(server).get('/api/v1/*');

      expect(res.status).toBe(404);
    });
  });
});
