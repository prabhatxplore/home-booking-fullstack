
// const { MongoCryptKMSRequestNetworkTimeoutError } = require("mongodb");
const Home = require("../models/home.js");
const User = require("../models/user.js");
const { default: mongoose } = require("mongoose");

exports.getHomeList = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.json({
      homes: registeredHomes,
      user: req.session.user ? req.session.user : null
    })
  })
};





exports.getHomeDetails = (req, res, next) => {

  const homeId = req.params.homeId;

  Home.findById(homeId).then(data => {
    if (data) {

      res.status(200).json({ success: true, home: data })
    } else {
      res.status(404).json({ success: false, message: "Home not found" })
    }
    // console.log(data);
  })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ success: false, message: "Internal Server Error" })

    });
};


