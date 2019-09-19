const Car = require('../models/carModels')


exports.getAllCars = async (req, res) => {
    try{
        const cars = await Car.find({})

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
  