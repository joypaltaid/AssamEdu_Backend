const express = require('express');

const { register, login, verifyOTP, logout, forgotPassword, resetPassword, googleAuth} = require('../controllers/userController');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { createOrder, verifyPayment } = require('../services/paymentService');
const { enrollInCourse } = require('../controllers/courseController');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    status: 429,
    error: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(limiter,login);

router.route('/auth/google').post(limiter, googleAuth);

router.route('/verify-otp').post(verifyOTP);

router.route('/logout').post(logout);

router.route('/forgot-password').post(limiter,forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/create-order').post(isAuthenticatedUser,createOrder);

router.route('/verify-payment/:courseId').post(isAuthenticatedUser,verifyPayment, enrollInCourse);

module.exports = router;