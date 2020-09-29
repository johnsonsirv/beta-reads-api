/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable no-undef */
const request = require('supertest');
const { Book } = require('../../../models/Book');
const { User } = require('../../../models/User');

let server;
const endPoint = '/api/v1/books';

describe('/api/v1/books', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await Book.remove({}); // clean up all documents
    await User.remove({});
  });

  describe('GET /', () => {
    it('should return all books', async () => {
      await Book.collection.insertMany([
        { title: 'Book 1', category: 'Horror' },
        { title: 'Book 2', category: 'Horror' },
      ]);

      const res = await request(server).get(`${endPoint}`);

      expect(res.status).toBe(200);
      expect(
        res.body.some(
          book => book.title === 'Book 1' && book.category === 'Horror',
        ),
      ).toBeTruthy();
      expect(
        res.body.some(
          book => book.title === 'Book 2' && book.category === 'Horror',
        ),
      ).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a book if a valid id is passed', async () => {
      const book = new Book({ title: 'Book 1', category: 'Horror' });
      await book.save();
      const res = await request(server).get(`${endPoint}/${book._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Book 1');
      expect(res.body).toHaveProperty('category', 'horror');
    });

    it('should return a 400 if an invalid id is passed', async () => {
      const res = await request(server).get(`${endPoint}/1`);

      expect(res.status).toBe(400);
    });

    it('should return a 404 if no book with given id exists', async () => {
      const book = new Book({ title: 'Book 1', category: 'Horror' });

      const res = await request(server).get(`${endPoint}/${book._id}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;

    const execSaveBook = () => {
      return request(server)
        .post(`${endPoint}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Book 1', category: 'Horror' });
    };

    beforeEach(async () => {
      const adminUser = await User.create({
        role: 'admin',
        name: 'Joe Brad',
        email: 'admin@gmail.com',
        password: 'admin1234',
      });

      token = adminUser.generateAuthToken();
    });

    it('should return 401 if user is unathorized', async () => {
      const res = await request(server)
        .post(`${endPoint}`)
        .send({ title: 'Book 1', category: 'Horror' });

      expect(res.status).toBe(401);
    });

    it('should return 400 bad request if title or category is missing', async () => {
      const res = await request(server)
        .post(`${endPoint}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it('should should save the book if it is valid', async () => {
      await execSaveBook();
      const book = await Book.findOne({ title: 'Book 1' });

      expect(book).not.toBeNull();
    });

    it('should should return the book in res.body if it is valid', async () => {
      const res = await execSaveBook();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'Book 1');
      expect(res.body).toHaveProperty('category', 'horror');
    });
  });

  describe('DELETE /', () => {
    let token;
    let bookId;

    const execRemoveBook = () => {
      return request(server)
        .delete(`${endPoint}/${bookId}`)
        .set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      const adminUser = await User.create({
        role: 'admin',
        name: 'Joe Brad',
        email: 'admin@gmail.com',
        password: 'admin1234',
      });

      token = adminUser.generateAuthToken();
    });

    it('should return 401 if user is unathorized', async () => {
      const res = await request(server).delete(`${endPoint}/${bookId}`);

      expect(res.status).toBe(401);
    });

    it('should return a 400 bad request if an invalid id is passed', async () => {
      bookId = 1;
      const res = await execRemoveBook();

      expect(res.status).toBe(400);
    });

    it('should return a 404 if no book with given id exists', async () => {
      const book = new Book({ title: 'Book 1', category: 'Horror' });
      bookId = book._id;

      const res = await execRemoveBook();

      expect(res.status).toBe(404);
    });

    it('should remove book from database if id is valid', async () => {
      const book = await Book.create({ title: 'Book 1', category: 'Horror' });

      const beforeRemove = await Book.findOne({ title: 'Book 1' });

      expect(beforeRemove).not.toBeNull();

      bookId = book._id;

      await execRemoveBook();

      const afterRemove = await Book.findOne({ title: 'Book 1' });

      expect(afterRemove).toBeNull();
    });

    it('should remove book from database and return it as a response', async () => {
      const book = await Book.create({ title: 'Book 1', category: 'Horror' });
      bookId = book._id;

      const res = await execRemoveBook();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'Book 1');
      expect(res.body).toHaveProperty('category', 'horror');
    });
  });
});
