const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();


router.route('/').get(carController.getAllCars).post(carController.postCar)
router.route('/:id').get(carController.getCar).patch(carController.updateCar).delete(carController.deleteCar)


module.exports = router;



// router.get('/', (req, res) => {
//     res.send('Birds home page');
// });


// router.get('/', carController.getAllCars)


