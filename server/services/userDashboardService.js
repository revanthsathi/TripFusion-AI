const User = require("../models/User");
const Trip = require("../models/Trip");
const Booking = require("../models/Booking");

// =======================
// User Dashboard
// =======================
const getUserDashboardData = async (userId) => {

    // =======================
    // User
    // =======================

    const user = await User.findById(userId)
        .select(
            "fullName email profileImage role"
        );

    if (!user) {
        throw new Error("User not found.");
    }


    // =======================
    // Trip Statistics
    // =======================

    const totalTrips =
        await Trip.countDocuments({
            user: userId
        });


    const upcomingTrips =
        await Trip.find({
            user: userId,
            startDate: {
                $gte: new Date()
            },
            status: {
                $nin: ["cancelled", "completed"]
            }
        })
            .populate(
                "destination",
                "name country"
            )
            .sort({
                startDate: 1
            })
            .limit(5);


    const recentTrips =
        await Trip.find({
            user: userId
        })
            .populate(
                "destination",
                "name country"
            )
            .sort({
                createdAt: -1
            })
            .limit(5);


    // =======================
    // Booking Statistics
    // =======================

    const totalBookings =
        await Booking.countDocuments({
            user: userId
        });


    const upcomingBookings =
        await Booking.find({
            user: userId,
            checkOut: {
                $gte: new Date()
            },
            bookingStatus: {
                $ne: "cancelled"
            }
        })
            .populate(
                "hotel",
                "name location images"
            )
            .sort({
                checkIn: 1
            })
            .limit(5);


    const recentBookings =
        await Booking.find({
            user: userId
        })
            .populate(
                "hotel",
                "name location images"
            )
            .sort({
                createdAt: -1
            })
            .limit(5);


    // =======================
    // Total Booking Spending
    // =======================

    const spending =
        await Booking.aggregate([

            {
                $match: {

                    user: userId,

                    paymentStatus: "paid"

                }
            },

            {
                $group: {

                    _id: null,

                    totalSpent: {
                        $sum: "$totalPrice"
                    }

                }
            }

        ]);


    return {

        user,

        statistics: {

            totalTrips,

            totalBookings,

            totalSpent:
                spending[0]?.totalSpent || 0

        },

        upcomingTrips,

        recentTrips,

        upcomingBookings,

        recentBookings

    };

};


module.exports = {

    getUserDashboardData

};