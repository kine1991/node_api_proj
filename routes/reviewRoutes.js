const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(reviewController.getAllReview).post(reviewController.createReview);

module.exports = router;