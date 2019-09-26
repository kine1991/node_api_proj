const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = async (req, res, next) => {
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordChangedAt: req.body.passwordChangedAt
        });

        // const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        //     expiresIn: process.env.JWT_EXPIRES_IN
        // });
        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                newUser
            }
        });
    } catch(err){
        next(err)
    }
};

exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        // 1) check email and password exist
        if(!email || !password){
            return next(new AppError('Please provide email and password', 400));
        }
        // 2) check if email && password is correct
        const user = await User.findOne({email}).select('+password'); // select('+password') извлекаем дополнительное поле
        if(!user || !( await user.correctPassword(password, user.password))){
            return next(new Error('Incorrect email or password', 401));
        };
        
        // 3) If everything ok send token to client
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch(err){
        next(err)
    }
};