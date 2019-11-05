const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.getAllUsers = factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User)

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }
    filteredBody = filterObj(req.body, 'name', 'email');
    // 2) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true // будет производить валидацию при обновлении
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false});
    console.log(req.user.id)
    console.log('req.user')
    res.status(204).json({
        status: 'success',
        data: null
    });
});

// exports.deleteUser = async (req, res, next) => {
//     try{
//         res.status(204).json({
//             status: 'success',
//             data: {
//                 user: null
//             }
//         });
//     } catch(err){
//         next(err);
//     }
// };

// exports.getAllUsers = async (req, res, next) => {
//     try{
//         const users = await User.find()

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 users
//             }
//         });
//     } catch(err) {
//         next(err);
//     }
// }
