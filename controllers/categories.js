const asyncHandler = require('../middleware/async');
const { Category } = require('../models/Category');
const { Book } = require('../models/Book');

/**
 * @description Get a list of book categories
 * @route GET /api/vi/categories
 * @access Public
 */
module.exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 }).select('name');
  res.status(200).json(categories);
});

/**
 * @description Get books belonging to a category
 * @route GET /api/vi/categories/:id/books
 * @access Public
 */

module.exports.getAllBooksByCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Book category not found' });
  }
  const exists = await Book.exists({ category: category.name });

  if (!exists) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const booksByCategory = await Book.find({ category: category.name }).select(
    'title category',
  );

  res.status(200).json(booksByCategory);
});
