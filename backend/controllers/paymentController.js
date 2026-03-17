
const Booking = require("../models/booking");
const stripe = require("../utils/stripe");

exports.createPaymentIntent = async (req, res, next) => {
    try {
        console.log(req.body)
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking"
            });
        }
        if (booking.paymentIntentId) {
            console.log("im inside the feature ur checking on")
            const existingIntent = await stripe.paymentIntents.retrieve(booking.paymentIntentId)
            console.log(existingIntent)
            console.log(existingIntent.status)
            if (existingIntent.status === "succeeded") {
                booking.status = "paid"
                await booking.save()
                return res.status(400).json({ success: false, message: "Already Paid" })
            }
        }

        if (["paid", "confirmed"].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                message: `Already ${booking.status}`
            });
        }
        const userId = req.session.user._id.toString()
        const paymentIntent = await stripe.paymentIntents.create({
            amount: booking.totalPrice * 100,
            currency: "usd",
            metadata: {
                bookingId: bookingId,
                userId: userId
            }
        })

        booking.paymentIntentId = paymentIntent.id
        await booking.save()



        res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret, message: "Created payment id" })


    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "failed" })
    }
}

exports.webHookHandler = async (req, res) => {
    console.log(req.body)
    console.log(req.headers)
    let event;
    try {
        const sig = req.headers["stripe-signature"];
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log("Webhook verification failed", err, err.message)
        return res.status(400).send(`webhook error ${err.message}`)
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object
        const bookingId = paymentIntent.metadata.bookingId

        try {
            const booking = await Booking.findById(bookingId)
            if (!booking) throw new Error("booking not found")
            if (booking.paymentIntentId === paymentIntent.id && booking.status === "paid") return res.status(200).send()
            booking.status = "paid"
            booking.save()
        } catch (err) {
            console.log(err)
            res.status(200).send()
        }
    }
    res.status(200).send()
}