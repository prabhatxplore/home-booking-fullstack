const mongoose = require('mongoose')


const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    home: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Home",
        require: true
    },
    checkIn: { type: Date, require: true },
    checkOut: { type: Date, require: true },
    totalPrice: { type: Number, require: true },
    paymentIntentId: { type: String },
    status: { type: String, enum: ["pending", "paid", "confirmed", "cancelled"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Bookings", bookingSchema)