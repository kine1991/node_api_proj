const User = require('../models/userModel');
const AppError = require('../utils/appError');

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