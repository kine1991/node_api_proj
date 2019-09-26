const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordChangedAt: req.body.passwordChangedAt
        });

        res.status(201).json({
            status: 'success',
            token: 'jhjhkjh',
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
    
        res.status(200).json({
            status: 'success',
            token: 'sfdfd'
        });
    } catch(err){
        next(err)
    }
};