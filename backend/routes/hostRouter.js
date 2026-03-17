const express = require("express");
const { postAddHome, getHostHome, postDeleteHome, getEditHome, postEditHome, getBookingsHost, cancelBookingHost, confirmBookingHost, getBookingHostSpecific } = require("../controllers/hostController.js");
const { isHost } = require("../middlewares/isHost.js");
const { isAuth } = require("../middlewares/isAuth.js");
const hostRouter = express.Router();

hostRouter.get("/host-homes", isAuth, isHost, getHostHome);
hostRouter.get("/edit-home/:homeId", isAuth, isHost, getEditHome);


hostRouter.post("/edit-home/:homeId", isAuth, isHost, postEditHome);
hostRouter.post("/add-home", isAuth, isHost, postAddHome);
hostRouter.delete("/delete-home/:homeId", isAuth, isHost, postDeleteHome);


// Dashboard
hostRouter.get("/get-bookings/", isAuth, isHost, getBookingsHost)
hostRouter.get("/get-bookings/:homeId", isAuth, isHost, getBookingHostSpecific)



// Confirm
hostRouter.post("/confirm-booking/:bookingId", isAuth, isHost, confirmBookingHost)
// Cancell
hostRouter.post("/cancel-booking/:bookingId", isAuth, isHost, cancelBookingHost)



module.exports = hostRouter;
