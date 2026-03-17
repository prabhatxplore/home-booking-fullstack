const express = require("express")
const { createPaymentIntent, webHookHandler } = require("../controllers/paymentController")
const { isGuest } = require("../middlewares/isGuest")
const paymentRouter = express.Router()
const webHookRouter = express.Router()

paymentRouter.post("/create-payment-intent", isGuest, createPaymentIntent)
webHookRouter.post("/payment/webhook", express.raw({ type: "application/json" }), webHookHandler)

exports.paymentRouter = paymentRouter
exports.webHookRouter = webHookRouter