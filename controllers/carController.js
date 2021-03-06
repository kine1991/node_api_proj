const Car = require('../models/carModels')
const APIFeatures = require('../utils/apiFeatures');
const AppErrpr = require('../utils/appError');
const factory = require('./handlerFactory');


exports.topExpensiveCar = async (req, res, next) => {
    req.query.sort = '-price';
    req.query.limit = 5;
    next();
}

// exports.getAllCars = async (req, res, next) => {
//     try{
//         const features = new APIFeatures(Car.find({}), req.query);

//         features
//             .filter()
//             .sort()
//             .limitFields()
//             .paginate();

//         const cars = await features.query;

//         res.status(200).json({
//             status: 'success',
//             retults: cars.length,
//             data: {
//                 cars: cars
//             }
//         })
//     } catch(err) {
//         console.log(err)
//         next(err);
//     }
// }

exports.getAllCars = factory.getAll(Car);
exports.getCar = factory.getOne(Car, {path: 'reviews'});
exports.postCar = factory.createOne(Car);
exports.deleteCar = factory.deleteOne(Car);
exports.updateCar = factory.updateOne(Car);


exports.getCarStats = async (req, res, next) => {
try{
    const stats = await Car.aggregate([
        {
            $match: {price: {$gte: 10000}}
        },
        {
            $group: {
                // _id: { $toUpper: '$transmission' }
                _id: '$transmission',
                count: { $sum: 1 },
                totalPrice: { $sum: '$price' },
                totalCylinder: { $sum: '$cylinder' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgRating: { $avg: '$ratingsAverage' },
                // carWithSomeTransmission: { $push: {brand: '$brand', model: '$model'} },
                carWithSomeTransmissionBrandAndModel: { $push: {  $concat: ['$brand', ' ', '$model']} }
            
            },
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
        });
} catch(err){
    res.status(404).json({
        status: 'fail',
        message: err
    });
}

}


exports.getCarByFeature = async (req, res, next) => {
    console.log(req.params.feature)
    try{
        const feature = await Car.aggregate([
            {
                $unwind: '$features'
            },
            {
                $match: {features: 'usb'}
            },
            {
                $sort: {price: 1}
            },
            {
                $project: {
                  protectCar: 0,
                }
            },
            {
                $addFields: { fullName: {$concat: ['$brand', ' ', '$model']} }
            },
        ])

        res.status(200).json({
            status: 'success',
            data: {
              feature
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getYearlyIncome = async (req, res, next) => {
    try{
        const year = req.params.year
        const income = await Car.aggregate([
            {
                $unwind: '$datesOfSale'
            },
            {
                $match: { 
                    datesOfSale: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    } 
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    yearIncome: { $sum: '$price' }
                }
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
              income
            }
        });
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

// exports.getCar = async (req, res, next) => {
//     try{
//         const car = await Car.findById(req.params.id)
//         .populate('reviews');

//         if(!car) {
//             return next(new AppErrpr('No car found with that ID', 404));
//         }

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 car: car
//             }
//         })
//     } catch(err){
//         next(err);
//     }   
// } 


// exports.postCar = async (req, res, next) => {
//     try{
//         console.log('req.body')
//         console.log(req.body)
//         const newCar = await Car.create(req.body)
//         console.log('newCar')
//         console.log(newCar)
//         res.status(201).json({
//             status: 'success',
//             data: {
//               car: newCar
//             }
//         });
//     } catch (err){
//         next(err);
//     }
// } 

// exports.updateCar = async (req, res, next) => {
//     try{
//         const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//         });

//         if (!car) {
//             return next(new AppError('No car found with that ID', 404));
//         };

//         res.status(201).json({
//             status: 'success',
//             data: {
//               car: car
//             }
//         });
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             massage: err
//         })
//     }
// }

// exports.deleteCar = async (req, res, next) => {
//     try {
//       const car = await Car.findByIdAndDelete(req.params.id);

//       if (!car) {
//         return next(new AppError('No car found with that ID', 404));
//       };

//       res.status(204).json({
//         status: 'success',
//         car: null
//       });
//     } catch (err) {
//       res.status(404).json({
//         status: 'fail',
//         message: 'err'
//       });
//     }
// };

  // exports.getAllCars = async (req, res, next) => {
//     try{
//         // const cars = await Car.find({ fuelType: { $regex: "elec", $options: '-i' }})
//         // 1) Filtering
//         let queryObj = {...req.query};
//         let excludedFields = ['page', 'sort', 'limit', 'fields'];
//         excludedFields.forEach(el => delete queryObj[el])

//         // 1.1) Advanced filtering
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, match => `$${match}`)
//         // console.log(queryStr)
//         let query = Car.find(JSON.parse(queryStr));

//         // 2) Sorting
//         if(req.query.sort){
//             const sortQuery = req.query.sort.split(',').join(' ')
//             // console.log(sortQuery) // -cylinder price
//             query.sort(sortQuery)
//         } 

//         // 3) Select some fields
//         if(req.query.fields){
//             const fieldsQuery = req.query.fields.split(',').join(' ')
//             // console.log(fieldsQuery)  // brand,model,price,year,color => brand model price year color
//             query = query.select(fieldsQuery) // исключаем name duration brand model price year color   _id по умолчанию включенно
//         } else {
//             query = query.select('-__v'); //исключаем __v
//         }

//         // 4) Pagination
//         const page = req.query.page * 1 || 1;
//         const limit = req.query.limit * 1 || 100;
//         const skip = (page - 1) * limit;
        
//         if (req.query.page) {
//             const numcars = await Car.countDocuments(); // countDocuments соличество документов
//             if (skip >= numcars) throw new Error('This page does not exist');
//         }
//         query = query.skip(skip).limit(limit);

//         const cars = await query

//         res.status(200).json({
//             status: 'success',
//             retults: cars.length,
//             data: {
//                 cars: cars
//             }
//         })
//     } catch(err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }
