const express = require('express');
const {
  getCategories,
  getAllBooksByCategory,
} = require('../controllers/categories');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/', getCategories);
router.get('/:id/books', validateObjectId, getAllBooksByCategory);

module.exports = router;
