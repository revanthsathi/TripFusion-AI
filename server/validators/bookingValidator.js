const Joi = require("joi");

const bookingSchema = Joi.object({

    hotel: Joi.string()
        .required(),

    trip: Joi.string()
        .allow(null, ""),

    roomType: Joi.string()
        .required(),

    roomsBooked: Joi.number()
        .integer()
        .min(1)
        .required(),

    numberOfGuests: Joi.number()
        .integer()
        .min(1)
        .required(),

    checkIn: Joi.date()
        .required(),

    checkOut: Joi.date()
        .greater(Joi.ref("checkIn"))
        .required(),

    paymentMethod: Joi.string()
        .valid(
            "cash",
            "card",
            "upi",
            "wallet"
        )
        .default("upi"),

    specialRequest: Joi.string()
        .allow("")
        .default("")

});

const validateBooking = (
    req,
    res,
    next
) => {

    const { error } =
        bookingSchema.validate(req.body);

    if (error) {

        return res.status(400).json({

            success: false,

            message:
                error.details[0].message

        });

    }

    next();

};

module.exports = {

    validateBooking

};