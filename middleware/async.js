// factory function

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch((ex) => {
  console.log('Internal Server Error', ex);
  next();
});

module.exports = asyncHandler;
