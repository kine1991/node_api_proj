const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');



const sendEmail = require('../utils/email');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
  
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      // secure: false,
      httpOnly: true // предотвратить cross site scripting attack
    };
    
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    // Remove password from output
    user.password = 'undefined';
    res.status(statusCode).json({
      status: 'success',
      token,
      user: {
        user: user
      }
    });
};

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
        // const token = signToken(newUser._id);

        // res.status(201).json({
        //     status: 'success',
        //     token,
        //     data: {
        //         newUser
        //     }
        // });
        createSendToken(newUser, 201, res);
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
        createSendToken(user, 200, res);
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
};

exports.resetPassword = async (req, res, next) => {
    try{
        console.log(req.params.token);
        // 1) Get user based on token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); // хешируем его
        const user = await User.findOne({
          passwordResetToken: hashedToken,
          passwordResetExpires: { $gt: Date.now() }
        });
        // 2) If token has not expired, and there is user set the new password
        if(!user){
            return next(new AppError('Token is invalid or has expired', 400));
        };
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        passwordResetToken = undefined;
        passwordResetExpires = undefined;
        await user.save();
    
        // 3) Update changedPasswordAt property for the user
        // 4) Log the user in send JWT
        createSendToken(user, 200, res);
    } catch(err){
        next(err)
    }
};

exports.updateMyPassword = async (req, res, next) => {
    try{
        // 1) Get user from collection
        const user = await User.findById(req.user._id).select('+password');
        if(!user){
            return next(new AppError('Current user do not exists', 400));
        }
        // 2) Check if POSTed current password is correct
        if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
            return next(new AppError('Current password is wrong', 401));
        }
        // If so update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        console.log(user)
        await user.save();
          // 4) Log user in, send JWT
        createSendToken(user, 200, res);
    } catch(err){
        next(err);
    }
};