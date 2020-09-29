const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/User');
const asyncHandler = require('./async');

module.exports.auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  // const { token: tokenInCookies } = req.cookies
  if (!authorization) {
    return res
      .status(401)
      .json({ message: 'Access denied. Missing Bearer Token' });
  }

  if (!authorization.startsWith('Bearer')) {
    return res
      .status(401)
      .json({ message: 'Access denied. Missing Bearer Token' });
  }
  // if (!tokenInCookies) {
  //   return res
  //     .status(401)
  //     .json({ message: 'Access denied. Missing Token' });
  // }

  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
});

module.exports.authorize = (...roles) => asyncHandler(async (req, res, next) => {
  const { role: userRole } = req.user;
  if (!roles.includes(userRole)) {
    return res
      .status(403)
      .json({ message: `Forbidden. User with role '${userRole}' cannot access this resource.` });
  }
  next();
});
