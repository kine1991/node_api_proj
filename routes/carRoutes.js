const express = require('express');
const carController = require('../controllers/carController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/top-5-expensive-car').get(carController.topExpensiveCar, carController.getAllCars);
router.route('/car-stats').get(carController.getCarStats);
router.route('/car-by-feature/:feature').get(carController.getCarByFeature);
router.route('/yearly-income/:year').get(carController.getYearlyIncome);
router.route('/').get(carController.getAllCars).post(carController.postCar);
router.route('/:id').get(carController.getCar).patch(carController.updateCar).delete(authController.protect, carController.deleteCar);


module.exports = router;



// router.get('/', (req, res) => {
//     res.send('Birds home page');
// });


// router.get('/', carController.getAllCars)

