const _ = require('lodash');
const asyncHandler = require('../middleware/async');
const { User, validate } = require('../models/User');

/**
 * @description Create a new User
 * @route POST /api/vi/users
 * @access Public
 */

module.exports.create = asyncHandler(async (req, res, next) => {
  const { error } = validate(req.body);
  const { name, email, password } = req.body;

  if (error) {
    return res
      .status(400)
      .json({ message: 'Bad Request', error: error.details[0].message });
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: `User with email '${email}' already exists`,
    });
  }

  // Create user if not exist
  user = await User.create({
    name,
    email,
    password,
  });

  // generate token
  const token = user.generateAuthToken();
  res.status(200).json({ user: _.pick(user, ['_id', 'name', 'email']), token });
});

/**
 * @description Get current logged in  user
 * @route POST /api/vi/users/me
 * @access Private
 */

module.exports.show = asyncHandler(async (req, res, next) => {
  res.status(200).json(_.pick(req.user, ['_id', 'name', 'email']));
});

/**
 * @description Get all users with role 'reviewers'
 * @route POST /api/vi/users/reviewers
 * @access Private, Role-based
 */
module.exports.getReviewers = asyncHandler(async (req, res, next) => {
  const reviewers = await User.find({ role: 'reviewer' });
  res.status(200).json(reviewers);
});
