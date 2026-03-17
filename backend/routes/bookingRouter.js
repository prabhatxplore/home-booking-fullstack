const express = require("express")

const bookingRouter = express.Router()

const { getBookings, createBooking, cancelBooking } = require("../controllers/bookingsController");
const { isAuth } = require("../middlewares/isAuth");
const { bookingValidator } = require("../validators/bookingValidator");
const { isGuest } = require("../middlewares/isGuest");

bookingRouter.get("/", isAuth, isGuest, getBookings);

bookingRouter.post("/create-booking", isAuth, isGuest, bookingValidator, createBooking)

bookingRouter.patch("/:bookingId/cancel-booking", isAuth, isGuest, cancelBooking)

module.exports = bookingRouter