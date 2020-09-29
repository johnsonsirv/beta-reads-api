const mongoose = require('mongoose');
const asyncHandler = require('./async');

module.exports.validateObjectId = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ message: 'Bad Request', error: 'Invalid Id' });
  }

  next();
});
