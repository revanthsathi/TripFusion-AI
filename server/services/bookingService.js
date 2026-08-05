const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

// =======================
// Create Booking
// =======================
const createBooking = async (
    userId,
    bookingData
) => {

    const {

        hotel: hotelId,

        trip,

        roomType,

        roomsBooked,

        numberOfGuests,

        checkIn,

        checkOut,

        paymentMethod,

        specialRequest

    } = bookingData;

    // =======================
    // Find Hotel
    // =======================
    const hotel = await Hotel.findById(
        hotelId
    );

    if (!hotel) {
        throw new Error(
            "Hotel not found."
        );
    }

    // =======================
    // Prevent Duplicate Booking
    // =======================
    const existingBooking =
        await Booking.findOne({

            user: userId,

            hotel: hotelId,

            bookingStatus: {
                $nin: [
                    "cancelled"
                ]
            },

            checkIn: {
                $lt: new Date(
                    checkOut
                )
            },

            checkOut: {
                $gt: new Date(
                    checkIn
                )
            }

        });

    if (existingBooking) {

        throw new Error(
            "You already have a booking for this hotel during the selected dates."
        );

    }

    // =======================
    // Validate Dates
    // =======================
    if (
        new Date(checkOut) <=
        new Date(checkIn)
    ) {

        throw new Error(
            "Check-out date must be after check-in date."
        );

    }

    // =======================
    // Find Room
    // =======================
    const room =
        hotel.rooms.find(

            r =>
                r.roomType ===
                roomType

        );

    if (!room) {

        throw new Error(
            "Room type not found."
        );

    }

    // =======================
    // Check Availability
    // =======================
    if (
        room.availableRooms <
        roomsBooked
    ) {

        throw new Error(
            "Requested rooms are not available."
        );

    }

    // =======================
    // Calculate Price
    // =======================
    const oneDay =
        1000 * 60 * 60 * 24;

    const nights =
        Math.ceil(

            (
                new Date(checkOut) -
                new Date(checkIn)
            ) / oneDay

        );

    const totalPrice =
        nights *
        room.pricePerNight *
        roomsBooked;

    // =======================
    // Reduce Available Rooms
    // =======================
    room.availableRooms -=
        roomsBooked;

    await hotel.save();

    // =======================
    // Save Booking
    // =======================
    const booking =
        await Booking.create({

            user: userId,

            hotel: hotelId,

            trip,

            roomType,

            roomsBooked,

            numberOfGuests,

            checkIn,

            checkOut,

            pricePerNight:
                room.pricePerNight,

            totalPrice,

            paymentMethod,

            specialRequest,

            bookingStatus:
                "pending"

        });

    return booking;

};

// =======================
// Get My Bookings
// =======================
const getBookings = async (
    userId
) => {

    return await Booking.find({

        user: userId

    })

        .populate(
            "hotel",
            "name images"
        )

        .populate(
            "trip",
            "title"
        )

        .sort({
            createdAt: -1
        });

};

// =======================
// Get Booking By ID
// =======================
const getBooking = async (
    bookingId,
    userId
) => {

    const booking =
        await Booking.findOne({

            _id: bookingId,

            user: userId

        })

            .populate("hotel")

            .populate("trip");

    if (!booking) {

        throw new Error(
            "Booking not found."
        );

    }

    return booking;

};
// =======================
// Cancel Booking
// =======================
const cancelBooking = async (
    bookingId,
    userId
) => {

    const booking = await Booking.findOne({
        _id: bookingId,
        user: userId
    });

    if (!booking) {
        throw new Error("Booking not found.");
    }

    if (booking.bookingStatus === "cancelled") {
        throw new Error("Booking already cancelled.");
    }

    if (booking.bookingStatus === "checked-out") {
        throw new Error("Completed bookings cannot be cancelled.");
    }

    const hotel = await Hotel.findById(
        booking.hotel
    );

    if (hotel) {

        const room = hotel.rooms.find(
            r => r.roomType === booking.roomType
        );

        if (room) {

            room.availableRooms += booking.roomsBooked;

            await hotel.save();

        }

    }

    booking.bookingStatus = "cancelled";

    await booking.save();

    return booking;

};

// =======================
// Confirm Booking
// =======================
const confirmBooking = async (
    bookingId
) => {

    const booking =
        await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found.");
    }

    if (booking.bookingStatus === "cancelled") {
        throw new Error("Cancelled bookings cannot be confirmed.");
    }

    if (booking.bookingStatus === "confirmed") {
        throw new Error("Booking is already confirmed.");
    }

    if (
        booking.bookingStatus === "checked-in" ||
        booking.bookingStatus === "checked-out"
    ) {
        throw new Error("Booking has already progressed.");
    }

    booking.bookingStatus = "confirmed";

    await booking.save();

    return booking;

};

// =======================
// Check-In
// =======================
const checkInBooking = async (
    bookingId
) => {

    const booking =
        await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found.");
    }

    if (booking.bookingStatus === "cancelled") {
        throw new Error("Cancelled bookings cannot check in.");
    }

    if (booking.bookingStatus !== "confirmed") {
        throw new Error("Only confirmed bookings can check in.");
    }

    booking.bookingStatus = "checked-in";

    await booking.save();

    return booking;

};

// =======================
// Check-Out
// =======================
const checkOutBooking = async (
    bookingId
) => {

    const booking =
        await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found.");
    }

    if (booking.bookingStatus !== "checked-in") {
        throw new Error("Only checked-in bookings can check out.");
    }

    booking.bookingStatus = "checked-out";

    await booking.save();

    return booking;

};

// =======================
// Admin - Get All Bookings
// =======================
const getAllBookings = async () => {

    return await Booking.find()

        .populate(
            "user",
            "fullName email"
        )

        .populate(
            "hotel",
            "name"
        )

        .populate(
            "trip",
            "title"
        )

        .sort({
            createdAt: -1
        });

};

// =======================
// Booking Statistics
// =======================
const getBookingStatistics = async () => {

    const totalBookings =
        await Booking.countDocuments();

    const confirmedBookings =
        await Booking.countDocuments({
            bookingStatus: "confirmed"
        });

    const cancelledBookings =
        await Booking.countDocuments({
            bookingStatus: "cancelled"
        });

    const checkedInBookings =
        await Booking.countDocuments({
            bookingStatus: "checked-in"
        });

    const checkedOutBookings =
        await Booking.countDocuments({
            bookingStatus: "checked-out"
        });

    const revenue =
        await Booking.aggregate([
            {
                $match: {
                    bookingStatus: {
                        $ne: "cancelled"
                    }
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

    return {

        totalBookings,

        confirmedBookings,

        cancelledBookings,

        checkedInBookings,

        checkedOutBookings,

        totalRevenue:
            revenue[0]?.totalRevenue || 0

    };

};

module.exports = {

    createBooking,

    getBookings,

    getBooking,

    cancelBooking,

    confirmBooking,

    checkInBooking,

    checkOutBooking,

    getAllBookings,

    getBookingStatistics

};