const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
    try {
        if (req.session.user && req.session.user._id) {

            const exists = await User.exists({ _id: req.session.user._id })
            if (exists) {
                return next();
            }
            return res.status(401).json({ success: false, message: "User doesnot exist" })
        }
        else {
            return res.status(401).json({ success: false, message: "Access Denied by auth" });
        }
    }
    catch (err) {
        console.error(err);
        console.error("is this the error");
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}