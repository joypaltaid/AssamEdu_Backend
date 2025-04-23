const { Op } = require('sequelize');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const Course = require('../models/Course');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorhandler');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const sendToken = require('../utils/jwtToken');
const { verifyGoogleTokenAndGetUserInfo } = require('../services/googleAuthService');

exports.register = catchAsyncErrors(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return next(new ErrorHandler("Email is already registered", 400));
    }

    const user = await User.create({ username, email, password, role });

    if (!user) {
        return next(new ErrorHandler("Failed to create user", 500));
    }

    res.status(200).json({
        success: true,
        message:"User Registered Successfully"
    })

});

exports.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    const otp = user.generateOTP();
    await user.save();

    try {
        const message = `Your OTP: ${otp}`;
        await sendEmail({
            email: user.email,
            subject: "OTP Verification",
            message,
        });

        res.status(200).json({success: true, message: 'OTP sent to your email'});
    } catch (emailError) {
        user.otp = null;
        user.otpExpiration = null;
        await user.save();
        
        return next(new ErrorHandler('Failed to send OTP. Please try again.', 500));
    }
});

exports.googleAuth = catchAsyncErrors(async(req, res, next)=> {
    const { idToken, role } = req.body;
    if (!idToken) {
        return next(new ErrorHandler("ID token is required", 400));
    }
    const { email, name, googleId } = await verifyGoogleTokenAndGetUserInfo(idToken);
    let user = await User.findOne({ where: { email } });
    if (!user) {
        user = await User.create({googleId,email,username: name,password: googleId,role});
    } else if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
    }
    sendToken(user, 200, res);
})

exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({
        where: {
            email,
            otp,
            otpExpiration: {
                [Op.gt]: Date.now(),
            },
        },
    });
    if (!user) {
        return next(new ErrorHandler('Invalid or expired OTP', 401));
    }
    user.otp = null;
    user.otpExpiration = null;
    await user.save();
    sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(200).json({ message: 'If an account with that email exists, you will receive a password reset email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Recovery',
            message,
        });

        res.status(200).json({success: true, message: 'If an account with that email exists, you will receive a password reset email' });
    } catch (err) {
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return next(new ErrorHandler('There was an error sending the email. Please try again later.', 500));
    }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        where: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { [Op.gt]: Date.now() },
        },
    });

    if (!user) {
        return next(new ErrorHandler('Invalid or expired token', 400));
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({success: true, message: 'Password reset successful' });
});




