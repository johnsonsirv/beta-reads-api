const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/index');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'reviewer', 'admin'],
    default: 'user',
  },
});

// hash password before save
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
};

userSchema.methods.matchPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password); // returns a promise
};

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required()
      .email(),
    password: Joi.string().min(5).max(18).required(),
  };

  return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validateUser;
