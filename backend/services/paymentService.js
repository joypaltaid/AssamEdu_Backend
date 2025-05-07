const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorhandler');

var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

exports.createOrder = catchAsyncErrors(async(req,res) => {
    const { userId } = req.user;
    const { amount, courseId } = req.body;
    const options = {
        amount: amount*100,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
    }
    const order = await razorpay.orders.create(options);
    res.json({sucess: true, orderId: order.id, amount, currency: order.currency});
});

exports.verifyPayment = catchAsyncErrors(async(req, res, next) => {
    const {orderId, paymentId, signature} = req.body;
    const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
    if(generatedSignature != signature) {
        return next(new ErrorHandler("Invalid signature", 400));
    }
    req.paymentId = paymentId;
    next();
});