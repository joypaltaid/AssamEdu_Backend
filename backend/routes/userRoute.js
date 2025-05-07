const express = require('express');

const { register, login, verifyOTP, logout, forgotPassword, resetPassword, googleAuth} = require('../controllers/userController');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { createOrder, verifyPayment } = require('../services/paymentService');
const { enrollInCourse } = require('../controllers/courseController');

const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/auth/google').post(googleAuth);

router.route('/verify-otp').post(verifyOTP);

router.route('/logout').post(logout);

router.route('/forgot-password').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/create-order').post(isAuthenticatedUser,createOrder);

router.route('/verify-payment').post(isAuthenticatedUser,verifyPayment, enrollInCourse);

module.exports = router;