const { check } = require("express-validator");

exports.bookingValidator = [
    check('homeId')
        .trim()
        .notEmpty().withMessage("Home ID is required")
        .isMongoId("not a valid home ID"),

    check('checkIn')
        .notEmpty().withMessage("Check In is required")
        .isISO8601().withMessage("Invalid date format")
        .toDate()
    ,
    check('checkOut')
        .notEmpty().withMessage("Check Out is required")
        .isISO8601().withMessage("Invalid date format")
        .toDate()
        .custom((value, { req }) => {
            const checkIn = req.body.checkIn
            const checkOut = value
            const current = new Date()
            current.setHours(0, 0, 0, 0)
            checkOut.setHours(0, 0, 0, 0)
            checkIn.setHours(0, 0, 0, 0)
            if (checkIn < current || checkOut < current) {
                throw new Error("Dates cannot be selected in past")
            }

            if (checkOut <= checkIn) {
                throw new Error("checkout comes after checkin")
            }
            return true
        })
]