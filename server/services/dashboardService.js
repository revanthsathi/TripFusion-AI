const User = require("../models/User");
const Trip = require("../models/Trip");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const Destination = require("../models/Destination");

// =======================
// Dashboard Analytics
// =======================
const getDashboardData = async () => {

    const totalUsers =
        await User.countDocuments();

    const totalTrips =
        await Trip.countDocuments();

    const totalHotels =
        await Hotel.countDocuments();

    const totalBookings =
        await Booking.countDocuments();

    const totalDestinations =
        await Destination.countDocuments();

    const revenue =
        await Booking.aggregate([

            {
                $match: {

                    paymentStatus: "paid"

                }
            },

            {
                $group: {

                    _id: null,

                    totalRevenue: {

                        $sum: "$totalPrice"

                    }

                }
            }

        ]);

    const recentBookings =
        await Booking.find()

            .populate(
                "user",
                "fullName email"
            )

            .populate(
                "hotel",
                "name"
            )

            .sort({

                createdAt: -1

            })

            .limit(5);

    const topHotels =
        await Hotel.find()

            .sort({

                averageRating: -1

            })

            .limit(5)

            .select(
                "name averageRating totalReviews"
            );

    const popularDestinations =
        await Destination.find()

            .sort({

                popularity: -1

            })

            .limit(5)

            .select(
                "name country"
            );

    return {

        totalUsers,

        totalTrips,

        totalHotels,

        totalBookings,

        totalDestinations,

        totalRevenue:
            revenue[0]?.totalRevenue || 0,

        recentBookings,

        topHotels,

        popularDestinations

    };

};

module.exports = {

    getDashboardData

};