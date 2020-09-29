/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable no-undef */
const request = require('supertest');
const { User } = require('../../../models/User');

let server;
const endPoint = '/api/v1/auth/login';

describe('POST /api/v1/auth/login', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await User.remove({}); // clean up all documents
  });

  it('should return 400 bad request if email or pasword inputs are invalid', async () => {
    const res = await request(server).post(`${endPoint}`).send({
      email: '',
      password: '',
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 bad request if email is missing', async () => {
    const res = await request(server).post(`${endPoint}`).send({
      password: '123456',
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 bad request if password is missing', async () => {
    const res = await request(server).post(`${endPoint}`).send({
      email: 'test@gmail.com',
    });

    expect(res.status).toBe(400);
  });

  it('should should return 401 if email does not match', async () => {
    await User.create({
      name: 'Test name',
      email: 'test@gmail.com',
      password: '123456',
    });
    const res = await request(server)
      .post(`${endPoint}`)
      .send({ email: 'wrongemail@gmail.com', password: '123456' });

    expect(res.status).toBe(401);
  });

  it('should should return 401 if password does not match', async () => {
    await User.create({
      name: 'Test name',
      email: 'test@gmail.com',
      password: '123456',
    });
    const res = await request(server)
      .post(`${endPoint}`)
      .send({ email: 'test@gmail.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('should should return token if email and password are valid', async () => {
    await User.create({
      name: 'Test name',
      email: 'test@gmail.com',
      password: '123456',
    });
    const res = await request(server)
      .post(`${endPoint}`)
      .send({ email: 'test@gmail.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
