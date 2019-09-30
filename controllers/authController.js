const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

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
            role: req.body.role,
            passwordChangedAt: req.body.passwordChangedAt,
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

exports.protect = async (req, res, next) => {
    try{
        // 1) Getting token and check of it's there
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            next(new Error('You are not logged in! Please log in to get access.', 401));
        }
        // 2) Verification token
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // если токен неправильный выдаст ошибку с именем JsonWebTokenError

        // 3) Check if user still exists
        const currentUser = await User.findById(decode.id);
        if(!currentUser){
            next(new Error('The user belonging to this token does no longer exist.', 401));
        }
        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decode.iat)) {
            next(new AppError('User recently  changed password! Please login again.', 401));
        }
        req.user = currentUser;
        // GRANT ACESS TO PROTECTED ROUTE
        next();
    } catch(err){
        console.log(err)
        next(err);
    }
};

exports.restrictTo = (...roles) => (req, res, next) => {
    try{
        if(!roles.includes(req.user.role)){
            next(new AppError('You do not have premission to perform this action', 403));
        }
        next();
    } catch(err){
        next(err);
    }
}

exports.forgotPassword = async (req, res, next) => {
    try{
        // 1) Get user based on posted email
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return next(new AppError('There is no user with email address', 404));
        }
        // 2) Generate random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save(); // { validateBeforeSave: false } - выключает всю валидацию в схеме
        // 3) Sent to email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didnt foget your password, please ignore this email!`;
        console.log(resetURL);
        try{
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message
            });
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        }catch(err){
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false }); // { validateBeforeSave: false } - выключает всю валидацию в схеме
        
            return next(
              new AppError(
                'There was an error sending the email& Try again later!',
                500
              )
            );
        }
    } catch(err){
        next(err);
    }
}