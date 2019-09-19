const Car = require('../models/carModels')


exports.getAllCars = async (req, res) => {
    try{
        // const cars = await Car.find({ fuelType: { $regex: "elec", $options: '-i' }})

        // 1) Filtering
        const queryObj = req.query;
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el])

        // 1.1) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, match => `$${match}`)
        // console.log(queryStr)
        let query = Car.find(JSON.parse(queryStr));

        
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
  