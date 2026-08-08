const Trip = require("../models/Trip");
const Booking = require("../models/Booking");

const {
    generateTripPDF,
    generateBookingPDF
} = require("../services/pdfService");

// =======================
// Download Trip PDF
// =======================
const downloadTripPDF = async (
    req,
    res
) => {

    try {

        const trip =
            await Trip.findOne({

                _id: req.params.id,

                user: req.user._id

            }).populate(
                "destination"
            );

        if (!trip) {

            return res.status(404).json({

                success: false,

                message:
                    "Trip not found."

            });

        }

        generateTripPDF(
            trip,
            res
        );

    } catch (error) {

        console.error(
            "TRIP PDF ERROR:",
            error.stack || error.message
        );

        if (!res.headersSent) {

            return res.status(500).json({

                success: false,

                message:
                    "Failed to generate trip PDF.",

                error:
                    error.message

            });

        }

    }

};

// =======================
// Download Booking PDF
// =======================
const downloadBookingPDF = async (
    req,
    res
) => {

    try {

        const booking =
            await Booking.findOne({

                _id: req.params.id,

                user: req.user._id

            }).populate(
                "hotel"
            );

        if (!booking) {

            return res.status(404).json({

                success: false,

                message:
                    "Booking not found."

            });

        }

        generateBookingPDF(
            booking,
            res
        );

    } catch (error) {

        console.error(
            "BOOKING PDF ERROR:",
            error.stack || error.message
        );

        if (!res.headersSent) {

            return res.status(500).json({

                success: false,

                message:
                    "Failed to generate booking PDF.",

                error:
                    error.message

            });

        }

    }

};

// =======================
// Exports
// =======================
module.exports = {

    downloadTripPDF,

    downloadBookingPDF

};