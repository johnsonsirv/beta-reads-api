/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/User');

let server;
const protectedEndpoint = '/api/v1/users';
const roleBasedEndpoint = `${protectedEndpoint}/reviewers`;

describe('auth middleware', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  let token;
  const exec = () => {
    return request(server)
      .get(`${protectedEndpoint}/me`)
      .set('Authorization', `Bearer ${token}`);
  };

  const accessPriviledgedRoutes = () => {
    return request(server)
      .get(`${roleBasedEndpoint}`)
      .set('Authorization', `Bearer ${token}`);
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(server).get(`${protectedEndpoint}/me`);

    expect(res.status).toBe(401);
  });

  it('should return 401 if no Bearer token is provided', async () => {
    const res = await request(server)
      .get(`${protectedEndpoint}/me`)
      .set('Authorization', `${token}`);

    expect(res.status).toBe(401);
  });

  it('should return 400 if Bearer token is invalid', async () => {
    token = 'a';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if Bearer token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should return 403 forbidden to restricted roles', async () => {
    const user = await User.create({
      name: 'Mark Peter',
      email: 'port@gmail.com',
      password: '123456',
    });

    token = user.generateAuthToken();

    const res = await accessPriviledgedRoutes();

    expect(res.status).toBe(403);
  });

  it('should grant access to priviledged roles', async () => {
    const adminUser = await User.create({
      role: 'admin',
      name: 'Joe Brad',
      email: 'admin@gmail.com',
      password: 'admin1234',
    });
    token = adminUser.generateAuthToken();

    const res = await accessPriviledgedRoutes();

    expect(res.status).toBe(200);
  });
});
