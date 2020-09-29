const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validateObjectId');
const {
  getBooks,
  createBook,
  updateBook,
  destroyBook,
  getBook,
} = require('../controllers/books');

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(auth, authorize('admin'), createBook); // protected, role-based route

router
  .route('/:id')
  .get(validateObjectId, getBook)
  .put(auth, authorize('admin'), validateObjectId, updateBook) // protected, role-based route
  .delete(auth, authorize('admin'), validateObjectId, destroyBook); // protected, role-based route

module.exports = router;
