const { check } = require("express-validator");


exports.signupValidator = [

    check('first_name')
        .trim()
        .isLength({ min: 2 })
        .withMessage("First Name should be at least 2 characters long")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("First Name should contain only alphabets"),

    check('last_name')
        .matches(/^[A-Za-z\s]*$/)
        .withMessage("Last Name should contain only alphabets"),

    check("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    check("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password should at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
        .withMessage("Password must contain uppercase, lowercase, number and special character"),

    check("confirm_password")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    check("user_type")
        .notEmpty()
        .withMessage("Please select user type")
        .isIn(['guest', 'host'])
        .withMessage("Invalid user type"),
    check("terms")
        .isBoolean()
        .custom(value => {
            if (!value) {
                throw new Error("Please accept terms and conditions")
            }
            return true
        })

]