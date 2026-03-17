const express = require("express");
const homeRouter = express.Router();
const {
  getHomeDetails,
  getHomeList,
} = require("../controllers/storeController.js");
const { isGuest } = require("../middlewares/isGuest.js");


homeRouter.get("/home", getHomeList)
homeRouter.get("/home-details/:homeId", getHomeDetails);



module.exports = homeRouter;
