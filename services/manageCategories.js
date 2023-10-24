const mongoose = require('mongoose');
const config = require('../config');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const intializeDatabase = async () => {
  try {
    const { mongodb: { url } } = config;
    await mongoose.connect(url, { useNewUrlParser: true });
    console.log('Connected to Mongo DB');
  } catch (error) {
    console.error(error.message);
  }
};

const Category = mongoose.model('Category', categorySchema);

const createCategory = async payload => {
  try {
    const category = new Category(payload);
    return await category.save();
  } catch (error) {
    console.log(error.message);
  }
};

const run = async () => {
  const categories = [
    { name: 'Action' },
    { name: 'Biography' },
    { name: 'History' },
    { name: 'Horror' },
    { name: 'Kids' },
    { name: 'Learning' },
    { name: 'Sci-Fi' },
  ];

  categories.forEach(async cat => {
    const result = await createCategory(cat);
    result ? console.log('saved', cat) : console.log('failed', cat);
  });
};

intializeDatabase();

exports.addAllCategories = run;
