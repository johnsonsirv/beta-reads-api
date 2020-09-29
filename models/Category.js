const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

exports.Category = Category;
