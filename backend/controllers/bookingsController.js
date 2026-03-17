const { default: mongoose } = require("mongoose");
const Home = require("../models/home");
const Booking = require("../models/booking");
const { validationResult } = require("express-validator");

exports.getBookings = async (req, res) => {
    const userId = req.session.user._id

    const myBooking = await Booking.find({ user: userId }).sort({ createdAt: -1 }).populate("home")
    res.status(200).json({
        success: true,
        bookings: myBooking,
        message: "Successfully fetched"
    })
};

exports.createBooking = async (req, res) => {
    try {
        const userId = req.session.user._id;

        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return res.status(422).json({
                success: false,
                message: "Booking Validation Failed",
                errors: errors.array().map(err => ({
                    [err.path]: err.msg
                }))
            })
        }
        const { homeId, checkIn, checkOut } = req.body;
        // console.log(req.body)


        // valid homeId
        if (!mongoose.isValidObjectId(homeId)) {
            return res.status(400).json({ success: false, message: "Invalid home ID" })
        }


        // check home exists or not
        const home = await Home.findOne({ _id: homeId })
        if (!home) {
            return res.status(404).json({ success: false, message: "Home doesnot exists" })
        }

        // Validate date
        const start = new Date(checkIn)
        start.setHours(0, 0, 0, 0)
        const end = new Date(checkOut)
        end.setHours(0, 0, 0, 0)

        if (start >= end) {
            return res.status(400).json({ success: false, message: "Check-out must be greater than Check-in" })
        }

        // check user at least books one day
        const night = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        if (night > 15) {
            return res.status(400).json({ success: false, message: "Booking is only available for maximum 15 days" })
        }



        const overlapping = await Booking.findOne({
            home: homeId,
            checkIn: { $lt: end }, //existing checkIn < new checkOut &&
            checkOut: { $gt: start }, //existing checkOut > new checkIn && 
            status: { $in: ["pending", "confirmed", "paid"] } // status with these pending paid and confirmed
        })

        if (overlapping) {
            return res.status(400).json({ success: false, message: "Home is not available for selected date" })
        }

        const totalPrice = night * home.price

        const booking = await Booking.create({
            user: userId,
            home: homeId,
            checkIn: start,
            checkOut: end,
            totalPrice,
            status: "pending"
        })

        return res.status(201).json({ success: true, booking, message: "Booking added successfully" })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: false,
            message: "Internal server error"
        })
    }
}



exports.cancelBooking = async (req, res) => {
    try {
        const userId = req.session.user._id

        if (!req.params) {
            return res.status(400).json({
                success: false,
                message: "Booking ID not sent"
            })
        }
        const { bookingId } = req.params;

        if (!mongoose.isValidObjectId(bookingId)) {
            return res.status(400).json({ success: false, message: "Invalid booking ID" })
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false, message: "Booking not found"
            })
        }

        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        if (booking.status === "confirmed" || booking.status === "paid") {
            return res.status(403).json({ success: false, message: `Cannot cancel paid and confirmed staged` })
        }
        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        })



    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}