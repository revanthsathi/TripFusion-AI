const {

    createOrder,

    verifyPayment,

    getPayment,

    getUserPayments

} = require("../services/paymentService");

const {

    sendSuccess,

    sendError

} = require("../utils/apiResponse");

// =======================
// Create Order
// =======================
const createPaymentOrder = async (

    req,

    res

) => {

    try {

        const result =
            await createOrder(

                req.body.bookingId,

                req.user._id

            );

        return sendSuccess(

            res,

            201,

            "Order created successfully.",

            result

        );

    } catch (error) {

        return sendError(

            res,

            400,

            error.message

        );

    }

};

// =======================
// Verify Payment
// =======================
const verifyPaymentOrder = async (

    req,

    res

) => {

    try {

        const payment =
            await verifyPayment(

                req.body

            );

        return sendSuccess(

            res,

            200,

            "Payment verified successfully.",

            payment

        );

    } catch (error) {

        return sendError(

            res,

            400,

            error.message

        );

    }

};

// =======================
// Get Payment
// =======================
const fetchPayment = async (

    req,

    res

) => {

    try {

        const payment =
            await getPayment(

                req.params.bookingId,

                req.user._id

            );

        return sendSuccess(

            res,

            200,

            "Payment fetched successfully.",

            payment

        );

    } catch (error) {

        return sendError(

            res,

            404,

            error.message

        );

    }

};

// =======================
// Payment History
// =======================
const fetchPayments = async (

    req,

    res

) => {

    try {

        const payments =
            await getUserPayments(

                req.user._id

            );

        return sendSuccess(

            res,

            200,

            "Payments fetched successfully.",

            payments

        );

    } catch (error) {

        return sendError(

            res,

            400,

            error.message

        );

    }

};

module.exports = {

    createPaymentOrder,

    verifyPaymentOrder,

    fetchPayment,

    fetchPayments

};