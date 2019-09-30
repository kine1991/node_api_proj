const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();


router.route('/').get(authController.protect, userController.getAllUsers);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/:id').delete(authController.protect, userController.deleteUser)

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);


module.exports = router;