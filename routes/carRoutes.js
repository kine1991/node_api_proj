const express = require('express');
const carController = require('../controllers/carController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router.use('/:carId/reviews', reviewRouter); // {mergeParams: true} позволяет передать параметр carId в другой роут
// router.route('/:carId/reviews').get(reviewController.getAllReview).post(authController.protect, reviewController.createReview);


router.route('/top-5-expensive-car').get(carController.topExpensiveCar, carController.getAllCars);
router.route('/car-stats').get(carController.getCarStats);
router.route('/car-by-feature/:feature').get(carController.getCarByFeature);
router.route('/yearly-income/:year').get(carController.getYearlyIncome);
router.route('/').get(carController.getAllCars).post(carController.postCar);
router.route('/:id').get(carController.getCar).patch(carController.updateCar).delete(authController.protect, authController.restrictTo('admin', 'moderator'), carController.deleteCar);

module.exports = router;

