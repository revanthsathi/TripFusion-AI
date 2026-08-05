const Joi = require("joi");

// =======================
// Hotel Validation Schema
// =======================
const hotelSchema = Joi.object({

    name: Joi.string()
        .min(3)
        .max(100)
        .required(),

    description: Joi.string()
        .allow("")
        .default(""),

    destination: Joi.string()
        .required(),

    address: Joi.string()
        .required(),

    latitude: Joi.number()
        .required(),

    longitude: Joi.number()
        .required(),

    contactNumber: Joi.string()
        .allow("")
        .default(""),

    website: Joi.string()
        .allow("")
        .default(""),

    images: Joi.array()
        .items(Joi.string())
        .default([]),

    amenities: Joi.array()
        .items(Joi.string())
        .default([]),

    rooms: Joi.array().items(

        Joi.object({

            roomType: Joi.string()
                .required(),

            pricePerNight: Joi.number()
                .positive()
                .required(),

            maxGuests: Joi.number()
                .positive()
                .required(),

            totalRooms: Joi.number()
                .min(0)
                .required(),

            availableRooms: Joi.number()
                .min(0)
                .required()

        })

    ).default([]),

    available: Joi.boolean()
        .default(true)

});

// =======================
// Validation Middleware
// =======================
const validateHotel = (
    req,
    res,
    next
) => {

    const { error } =
        hotelSchema.validate(
            req.body
        );

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

    validateHotel

};