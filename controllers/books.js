const asyncHandler = require('../middleware/async');
const { Book, validate } = require('../models/Book');

/**
 * @description Get a list of books
 * @route GET /api/vi/books
 * @access Public
 */
module.exports.getBooks = asyncHandler(async (req, res, next) => {
  const books = await Book.find()
    .sort({ title: 1 })
    .select('id title category');

  res.status(200).json(books);
});

/**
 * @description Get a single book
 * @route GET /api/vi/books/:id
 * @access Public
 */
module.exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.status(200).json(book);
});

/**
 * @description Create a new book
 * @route POST /api/vi/books
 * @access Private, Role-based
 */

module.exports.createBook = asyncHandler(async (req, res, next) => {
  const { error } = validate(req.body);
  const { title, category } = req.body;

  if (error) {
    return res
      .status(400)
      .json({ message: 'Bad Request', error: error.details[0].message });
  }

  const book = await Book.create({
    title,
    category,
  });

  res.status(200).json(book);
});

/**
 * @description Update a book details
 * @route PUT /api/vi/books/:id
 * @access Private, Role-based
 */

module.exports.updateBook = asyncHandler(async (req, res, next) => {});

/**
 * @description Delete a book
 * @route DELETE /api/vi/books/:id
 * @access Private, Role-based
 */

module.exports.destroyBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book) {
    return res.status(404).json({ message: 'Resource not found' });
  }
  res.status(200).json(book);
});
