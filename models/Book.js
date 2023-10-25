const Joi = require('joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const Book = mongoose.model('Book', bookSchema);

const validateBook = (book) => {
  const schema = {
    title: Joi.string().required(),
    category: Joi.string().required(),
  };

  return Joi.validate(book, schema);
};

exports.Book = Book;
exports.validate = validateBook;
