const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

// router.get('/', (req, res) => {
//     res.send('Birds home page');
// });


// router.get('/', carController.getAllCars)
router.route('/').get(carController.getAllCars).post(carController.postCar)

router.route('/:id').get(carController.getCar).patch(carController.updateCar)


module.exports = router;



// exports.getAllTours = async (req, res) => {
//     try {
//       // console.log(req.query);
//       // BUILD QUERY
//       // 1) Filtering
//       const queryObj = { ...req.query };
//       const excludedFields = ['page', 'sort', 'limit', 'fields'];
//       excludedFields.forEach(el => delete queryObj[el]);
  
//       // 2) Advanced filtering
//       let queryStr = JSON.stringify(queryObj);
//       queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, match => `$${match}`);
//       // console.log(JSON.parse(queryStr));
//       let query = Tour.find(JSON.parse(queryStr));
  
//       // 3) Sorting
//       if (req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(' ');
//         console.log(sortBy); // -price ratingAverage
//         // query = query.sort(req.query.sort); //http://localhost:3000/api/v1/tours?sort=-price
//         query = query.sort(sortBy); // http://localhost:3000/api/v1/tours?sort=-price,ratingAverage
//       } else {
//         query = query.sort('-createdAt');
//       }
  
//       // 4) Limit
//       if (req.query.fields) {
//         const fields = req.query.fields.split(',').join(' ');
//         query = query.select(fields); // исключаем name duration difficulty price   _id по умолчанию включенно
//       } else {
//         query = query.select('-__v'); //исключаем __v
//       }
  
//       // 5) Pagination
//       const page = req.query.page * 1 || 1;
//       const limit = req.query.limit * 1 || 100;
//       const skip = (page - 1) * limit;
  
//       query = query.skip(skip).limit(limit);
  
//       if (req.query.page) {
//         const numTours = await Tour.countDocuments();
//         if (skip >= numTours) throw new Error('This page does not exist');
//         // countDocuments соличество документов
//       }
  
//       // EXECUTE QUERY
//       const tours = await query;
  
//       // SEND RESPONSE
//       res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//           tours: tours
//         }
//       });
//       // { difficulty: 'easy', duration: { gte: '5' } }
//       // const query = Tour.find()
//       //   .where('duration')
//       //   .equals(5)
//       //   .where('difficulty')
//       //   .equals('easy');
//     } catch (err) {
//       res.status(404).json({
//         status: 'fail',
//         message: err
//       });
//     }
//   };



// exports.getTour = async (req, res) => {
//     try {
//       // const tour = await Tour.findOne({ _id: req.params.id });
//       const tour = await Tour.findById(req.params.id);
  
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour: tour
//         }
//       });
//     } catch (err) {
//       res.status(404).json({
//         status: 'fail',
//         message: err
//       });
//     }
//   };