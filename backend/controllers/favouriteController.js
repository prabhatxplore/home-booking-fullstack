const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const user = require("../models/user");



exports.getFavouriteList = async (req, res, next) => {
    try {
        const userId = req.session.user._id
        const user = await User.findOne({ _id: userId }).select("-password").populate("favourites")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.favourites.length == 0) {
            return res.status(200).json({
                success: true,
                message: "Favourite is empty",
                favourites: []
            })
        }

        return res.status(200).json({
            success: true,
            message: "Favourite found",
            favourites: user.favourites
        })
    }

    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }



};
exports.postFavourite = async (req, res, next) => {
    try {
        const homeId = req.params.homeId;
        const userId = req.session.user._id

        if (!mongoose.isValidObjectId(homeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid home ID"
            })
        }

        const user = await User.findByIdAndUpdate(userId, { $addToSet: { favourites: homeId } }, { new: true }).select("-password").populate("favourites")


        return res.status(200).json({
            success: true,
            message: "Favourite added successfully",
            favourites: user.favourites
        })




    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }

};

exports.deleteFavourite = async (req, res, next) => {
    try {
        const homeId = req.params.homeId;
        const userId = req.session.user._id

        if (!mongoose.isValidObjectId(homeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid home ID"
            })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favourites: homeId } }, { new: true }).select("-password").populate("favourites")


        res.status(200).json({
            success: true,
            message: "Favourites removed",
            favourites: user.favourites
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}