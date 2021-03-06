const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setCarUserIds = (req, res, next) => {
    console.log('req.params')
    console.log(req.params)
    if(!req.body.car) req.body.car = req.params.carId;
    if(!req.body.user) req.body.user = req.user._id;
    next();
}

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// exports.getAllReview = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if(req.params.carId) filter = {car: req.params.carId}
//     const reviews = await Review.find(filter)

//     res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//     if(!req.body.car) req.body.car = req.params.carId;
//     if(!req.body.user) req.body.user = req.user._id
//     // console.log(req.body)
//     const newReview = await Review.create(req.body)

    
//     res.status(201).json({
//         status: 'success',
//         data: {
//             reviews: newReview
//         }
//     });
// });