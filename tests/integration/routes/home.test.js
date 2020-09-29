/* eslint-disable global-require */
/* eslint-disable no-undef */
const request = require('supertest');

let server;

describe('/api/v1/', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
  });

  describe('GET /', () => {
    it('should return 200 if server is up and running', async () => {
      const res = await request(server).get('/');
      expect(res.status).toBe(200);
    });
  });
});
