const Car = require('../models/carModels')


exports.getAllCars = async (req, res) => {
    res.send('getAllCars');
}

exports.getCar = async (req, res) => {
    const id = req.params.id
    res.send('getCar ' +id);
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
            status: 'success',
            massage: err
        })
    }


    // console.log('req.body')
    // console.log(req.body)
    // const newCar = await Car.create(req.body);
} 