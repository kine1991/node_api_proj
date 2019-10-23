const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({mergeParams: true}); // {mergeParams: true} позволяет в данном роуте использовать параметры другово

router.use(authController.protect);

router.route('/').get(reviewController.getAllReview).post(reviewController.createReview);
router.route('/:id').delete(reviewController.deleteReview);

module.exports = router; 