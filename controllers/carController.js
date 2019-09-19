const Car = require('../models/carModels')


exports.getAllCars = async (req, res) => {
    try{
        // const cars = await Car.find({ fuelType: { $regex: "elec", $options: '-i' }})
        // 1) Filtering
        let queryObj = {...req.query};
        let excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el])

        // 1.1) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, match => `$${match}`)
        // console.log(queryStr)
        let query = Car.find(JSON.parse(queryStr));

        // 2) Sorting
        if(req.query.sort){
            const sortQuery = req.query.sort.split(',').join(' ')
            // console.log(sortQuery) // -cylinder price
            query.sort(sortQuery)
        } 

        // 3) Select some fields
        if(req.query.fields){
            const fieldsQuery = req.query.fields.split(',').join(' ')
            // console.log(fieldsQuery)  // brand,model,price,year,color => brand model price year color
            query = query.select(fieldsQuery) // исключаем name duration brand model price year color   _id по умолчанию включенно
        } else {
            query = query.select('-__v'); //исключаем __v
        }

        // 4) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        
        if (req.query.page) {
            const numTours = await Car.countDocuments(); // countDocuments соличество документов
            if (skip >= numTours) throw new Error('This page does not exist');
        }
        
        query = query.skip(skip).limit(limit);
        




        
        const cars = await query

        res.status(200).json({
            status: 'success',
            retults: cars.length,
            data: {
                cars: cars
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
    

}

exports.getCar = async (req, res) => {
    try{
        const car = await Car.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                car: car
            }
        })
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }   
}

exports.postCar = async (req, res) => {
    try{
        const newCar = await Car.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
              car: newCar
            }
        });
    } catch (err){
        res.status(400).json({
            status: 'fail',
            massage: err
        })
    }
} 

exports.updateCar = async (req, res) => {
    try{
        const car = await Car.findByIdAndUpdate(req.params.id, {"model": "model"}, {
            new: true,
            runValidators: true,
        })

        res.status(201).json({
            status: 'success',
            data: {
              car: car
            }
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            massage: err
        })
    }
}

exports.deleteCar = async (req, res) => {
    try {
      await Car.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: 'success',
        car: null
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: 'err'
      });
    }
  };
  