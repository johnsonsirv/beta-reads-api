const config = require('config');
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

const app = express();

// middlewares
app.use(express.json());
app.use(helmet());

if (!config.get('jwtPrivateKey') && !config.get('jwtExpire')) {
  console.error('FATAL: jwtPrivateKey & options not defined');
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
    const host = config.get('db.host');
    const dbName = config.get('db.name');
    const dbConnectionString = `${host}/${dbName}`;
    await mongoose.connect(dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error.message);
  }
};

intializeDatabase();

// PORT
const port = process.env.PORT || 3000;
const appName = config.get('name');
const dbName = config.get('db.name');
const server = app.listen(port, () => {
  console.log(`${appName} listening on ${port} with db: ${dbName}`);
});

module.exports = server;
