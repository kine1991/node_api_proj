
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync( async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    };

    res.status(204).json({
      status: 'success',
      doc: null
    });
});
 
exports.updateOne = Model => catchAsync( async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: doc
  });
});

exports.createOne = Model => catchAsync( async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
});
});

// exports.postCar = async (req, res, next) => {
//   try{
//       console.log('req.body')
//       console.log(req.body)
//       const newCar = await Car.create(req.body)
//       console.log('newCar')
//       console.log(newCar)
//       res.status(201).json({
//           status: 'success',
//           data: {
//             car: newCar
//           }
//       });
//   } catch (err){
//       next(err);
//   }
// } 