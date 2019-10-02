const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = async (req, res, next) => {
    try{
        const users = await User.find()

        res.status(201).json({
            status: 'success',
            data: {
                users
            }
        });
    } catch(err) {
        next(err);
    }

}

exports.deleteUser = async (req, res, next) => {
    try{
        res.status(204).json({
            status: 'success',
            data: {
                user: null
            }
        });
    } catch(err){
        next(err);
    }
}