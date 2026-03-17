const express = require("express");
const { getFavouriteList, postFavourite, deleteFavourite } = require("../controllers/favouriteController");
const { isAuth } = require("../middlewares/isAuth");
const { isGuest } = require("../middlewares/isGuest");
const favouriteRouter = express.Router()



favouriteRouter.get("/", isAuth, isGuest, getFavouriteList);

favouriteRouter.post("/add-fav/:homeId", isAuth, isGuest, postFavourite);

favouriteRouter.delete("/remove-fav/:homeId", isAuth, isGuest, deleteFavourite);

module.exports = favouriteRouter
