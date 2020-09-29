/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable no-undef */
const request = require('supertest');
const { Category } = require('../../../models/Category');
const { Book } = require('../../../models/Book');

let server;
const endPoint = '/api/v1/categories';

describe('/api/v1/categories', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await Category.remove({}); // clean up all documents
    await Book.remove({});
  });

  describe('GET /', () => {
    it('should return all categories', async () => {
      await Category.collection.insertMany([
        { name: 'Action' },
        { name: 'Biography' },
        { name: 'History' },
        { name: 'Horror' },
        { name: 'Kids' },
        { name: 'Learning' },
        { name: 'Sci-Fi' },
      ]);

      const res = await request(server).get(`${endPoint}`);

      expect(res.status).toBe(200);
      expect(res.body.some(c => c.name === 'Action')).toBeTruthy();
      expect(res.body.some(c => c.name === 'Biography')).toBeTruthy();
      expect(res.body.some(c => c.name === 'History')).toBeTruthy();
    });
  });

  describe('GET /:id/books', () => {
    it('should return 400 bad request if given id is invalid', async () => {
      const res = await request(server).get(`${endPoint}/1/books`);

      expect(res.status).toBe(400);
    });

    it('should return 404 if no category with given id exists', async () => {
      const category = new Category({ name: 'Action' });

      const res = await request(server).get(`${endPoint}/${category._id}/books`);

      expect(res.status).toBe(404);
    });

    it('should return 404 if no books exists for given id', async () => {
      const category = new Category({ name: 'Action' });
      await category.save();

      const res = await request(server).get(`${endPoint}/${category._id}/books`);

      expect(res.status).toBe(404);
    });

    it('should return all books belonging to category if id is valid', async () => {
      const category = new Category({ name: 'History' });
      await category.save();

      await Book.collection.insertMany([
        { title: 'Book 1', category: 'history' },
        { title: 'Book 2', category: 'history' },
      ]);

      const res = await request(server).get(
        `${endPoint}/${category._id}/books`,
      );

      expect(res.status).toBe(200);
      expect(res.body.some(b => b.title === 'Book 1')).toBeTruthy();
      expect(res.body.some(b => b.title === 'Book 2')).toBeTruthy();
    });
  });
});
