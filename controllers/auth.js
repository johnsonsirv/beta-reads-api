const Joi = require('joi');
const asyncHandler = require('../middleware/async');
const { User } = require('../models/User');

/**
 * @description User login controller
 * @route POST /api/vi/auth/login
 * @access Public
 */

const validate = req => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(18).required(),
  };

  return Joi.validate(req, schema);
};

module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: 'Bad Request', error: error.details[0].message });
  }

  // Check user email and password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password',
    });
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      message: 'Invalid email or password',
    });
  }

  const token = user.generateAuthToken();
  res.status(200).json({ token });
});
