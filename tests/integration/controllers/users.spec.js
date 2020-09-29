/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable no-undef */
const request = require('supertest');
const { User } = require('../../../models/User');

let server;
const endPoint = '/api/v1/users';

describe('/api/v1/users', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await User.remove({}); // clean up all documents
  });

  describe('POST /', () => {
    const execCreateUser = () => {
      return request(server).post(`${endPoint}`).send({
        name: 'Test name',
        email: 'test@gmail.com',
        password: '123456',
      });
    };

    it('should return 400 bad request if input values are missing', async () => {
      const res = await request(server).post(`${endPoint}`).send({});
      expect(res.status).toBe(400);
    });

    it('should return 400 bad request if user with email already exists', async () => {
      await User.create({
        name: 'Test name',
        email: 'test@gmail.com',
        password: '123456',
      });

      const res = await execCreateUser();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should should save User to database', async () => {
      await execCreateUser();

      const user = await User.findOne({ email: 'test@gmail.com' });

      expect(user).not.toBeNull();
    });

    it('should return token after registration', async () => {
      const res = await execCreateUser();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('GET /me', () => {
    it('should return currently logged in user with valid token', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
      });
      const token = user.generateAuthToken();

      const res = await request(server)
        .get(`${endPoint}/me`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'johndoe@gmail.com');
    });
    it('should return 401 unauthorized if user is not logged in', async () => {
      const res = await request(server).get(`${endPoint}/me`);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
});
