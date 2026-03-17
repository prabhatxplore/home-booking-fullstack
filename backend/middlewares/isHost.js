exports.isHost = (req, res, next) => {
    if (req.session.user && req.session.user.user_type === "host") {
        console.log("this is the host my guy")
        next();
    } else {
        res.status(403).json({ success: false, message: "Access Denied by host" });
    }
}