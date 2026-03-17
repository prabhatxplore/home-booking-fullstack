const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const Home = require("../models/home");


exports.postSignup = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: "Signup failed",
                errors: errors.array().map(err => ({
                    [err.path]: err.msg
                })),
            });

        }


        const { first_name, last_name, email, password, user_type } = req.body

        // check user already exist
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(422).json({
                success: false,
                errors: [{ field: "email", message: "Email already exists" }]
            });
        }


        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ first_name, last_name, password: hashedPassword, user_type, email })
        await user.save()

        // save session for the user
        req.session.user = {
            _id: user._id,
            user_type: user.user_type,
            email: user.email,
        }

        await req.session.save()


        res.status(201).json({
            success: true,
            message: "User created and logged in",
            user: req.session.user
        })


    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong try again later",

        });
    }

}


exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
    }


    req.session.user = {
        _id: user._id,
        user_type: user.user_type,
        first_name: user.first_name,
        email: user.email
    }
    req.session.save(err => {
        if (!err) {

            return res.status(200).json({
                success: true,
                message: "Login Successful",
                user: req.session.user
            })
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    })



}
exports.postLogOut = (req, res, next) => {
    // console.log('Im at Logout', req.session.isLogged)
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: "Something went wrong while logging out"
            })
        } else {
            res.clearCookie("connect.sid");
            res.status(200).json({
                success: true,
                message: "Logged Out Successfully"
            })
        }
    })
}


exports.getSessionUser = (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({
            success: true,
            user: req.session.user
        })
    } else {
        res.status(200).json({ user: null })
    }
}


exports.deleteUser = async (req, res, next) => {
    // Deletes all the homes
    // Deletes all booking
    try {
        const userId = req.session.user._id

        await Home.deleteMany({ owner: userId })
        // booking code also future


        const deleteHome = await User.findByIdAndDelete(userId);

        if (!deleteHome) {
            // send user not found
            return res.status(404).json({ status: false, message: "User not found" })
        }
        req.session.destroy(() => {
            res.status(200).json({ success: true, message: "Account deleted successfully" })
        })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}