const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const notFound = require('./routes/notFound');
const home = require('./routes/home');
const categories = require('./routes/categories');
const books = require('./routes/books');
const users = require('./routes/users');
const auth = require('./routes/auth');
const config = require('./config/index');

const app = express();

// middlewares
app.use(express.json());
app.use(helmet());

if ((!config.jwt.secret) && (!config.jwt.expiresIn)) {
  console.error('FATAL: jwt options not defined');
  process.exit(1);
}

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled');
}

//  Mount Routes
app.use('/', home);
app.use('/api/v1/categories', categories);
app.use('/api/v1/books', books);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use('*', notFound);

const intializeDatabase = async () => {
  try {
    // Connect to DB
    const { mongodb: { url } } = config;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  catch (error) {
    console.error(error.message);
  }
};

intializeDatabase();

// PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`${config.appName} listening on ${port}`);
});

module.exports = server;
