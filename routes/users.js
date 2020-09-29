const express = require('express');
const { show, create, getReviewers } = require('../controllers/users');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', create);
router.get('/me', auth, show); // protected route
router.get('/reviewers', auth, authorize('admin'), getReviewers);

module.exports = router;
