const { default: mongoose } = require("mongoose");
const Home = require("../models/home");
const fs = require("fs").promises
const path = require("path");
const Booking = require("../models/booking");

exports.getBookingsHost = async (req, res, next) => {
  const userId = req.session.user._id
  const hostHomes = await Booking.aggregate([
    {
      $lookup: {
        from: "homes",
        localField: "home",
        foreignField: "_id",
        as: "homeDetails"
      }
    },
    { $unwind: "$homeDetails" },
    {
      $match: {
        'homeDetails.owner': new mongoose.Types.ObjectId(userId)
      }
    }
  ])





  if (hostHomes) {
    return res.status(200).json({ success: true, message: "Booking successfully fetched", hostHomes })
  } else {

    return res.status(500).json({ success: false, message: "Internal server error" })

  }
}
exports.getBookingHostSpecific = async (req, res) => {
  try {
    console.log("Im fucking this")
    const homeId = new mongoose.Types.ObjectId(req.params.homeId)
    const userId = req.session.user._id
    const booking = await Booking.find({ home: homeId }).populate("home")
    const filtered = booking.filter(homeBook => homeBook.home.owner.toString() === userId.toString())
    return res.status(200).json({ success: true, message: "Booking successfully fetched", booking: filtered })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Internal server error" })

  }
}
exports.cancelBookingHost = async (req, res, next) => {
  try {
    const userId = req.session.user._id
    const bookingId = req.params.bookingId
    const booking = await Booking.findById(bookingId)

    if (booking.status === "confirmed" || booking.status === "paid") {
      return res.status(403).json({ success: false, message: "Cannot cancel paid booking" })
    }
    booking.status = "cancelled"
    booking.save()

    return res.status(200).json({ success: true, message: "Cancelled successfully" })
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}
exports.confirmBookingHost = async (req, res, next) => {
  try {
    const userId = req.session.user._id
    const bookingId = req.params.bookingId
    const booking = await Booking.findById(bookingId)
    if (booking.status === "paid") {

      booking.status = "confirmed"
      booking.save()
    } else {
      return res.status(401).json({ success: false, message: "Not done payment" })
    }

    return res.status(200).json({ success: true, message: "Confirmed successful" })
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

exports.getEditHome = async (req, res, next) => {
  const homeId = new mongoose.Types.ObjectId(req.params.homeId);
  const userId = new mongoose.Types.ObjectId(req.session.user._id);
  console.log("im at get edit home")
  try {
    if (!mongoose.isValidObjectId(homeId)) {
      return res.status(404).json({ success: false, message: "Not valid homeId" })
    }
    const homeEdit = await Home.findOne({
      _id: homeId,
      owner: userId
    })
    if (!homeEdit) {
      return res.status(404).json({ success: false, message: "Home not Found" })
    }

    res.status(200).json({ success: true, message: "Home found successfully", home: homeEdit })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: "Internal server error" })
  }

};

exports.postEditHome = async (req, res, next) => {
  const { house_name, price, location, description } = req.body;
  const paramsHomeId = req.params.homeId
  const homeId = new mongoose.Types.ObjectId(paramsHomeId);
  const userId = new mongoose.Types.ObjectId(req.session.user._id);
  try {
    const home = await Home.findOne({
      _id: homeId,
      owner: userId
    })
    if (!home) {
      return res.status(404).json({ success: false, message: "Home not found" })
    }
    home.house_name = house_name;
    home.price = price;
    home.location = location;
    home.description = description

    // If a new image is provided, delete the old one and update DB path.
    // If no new image, keep the existing photo.
    if (req.file) {
      // home.photo currently stores something like "/uploads/filename.jpg"
      const oldFileName = path.basename(home.photo || "");

      const oldFilePath = path.join(__dirname, "..", "uploads", oldFileName);

      await fs.unlink(oldFilePath).catch(err => console.error("Error saving file : ", oldFileName));


      // Save new image path in DB
      home.photo = "/uploads/" + req.file.filename;
    }
    await home.save()

    return res.status(200).json({ success: true, message: "Home updated Successfully" })
  } catch (err) {
    console.log(err)
    // Send a friendly error to the user
    return res.status(500).json({ success: false, message: "Failed to update home. Please try again." });
  }


};

exports.getHostHome = async (req, res, next) => {
  console.log(req.url)
  const userId = req.session.user._id


  const hostHomes = await Home.find({ owner: userId })

  return res.status(200).json({ success: true, homes: hostHomes })

};

exports.postAddHome = (req, res, next) => {
  const { house_name, price, location, description } = req.body;


  if (!req.file) {
    return res.status(422).send("No image provided");
  }

  const photo = "/uploads/" + req.file.filename

  const home = new Home({
    house_name,
    price,
    location,
    photo,
    description,
    owner: req.session.user._id
  });


  home.save().then(() => {
    console.log('Home save success');
    res.status(200).json({ success: true, message: "Home saved successfully" })
  });
};

exports.postDeleteHome = async (req, res, next) => {
  // console.log(req.params.homeId);
  console.log("im at post delete")
  try {
    const homeId = req.params.homeId
    const userId = req.session.user._id
    const home = await Home.findOne({ _id: homeId, owner: userId })

    if (!home) {
      return res.status(404).json({ success: false, message: "Home not found or unauthorized" });
    }

    // file deleting process
    if (home.photo) {
      const fileName = path.basename(home.photo)
      const filePath = path.join(__dirname, "..", "uploads", fileName);

      await fs.unlink(filePath).catch(err => {
        if (err.code !== "ENOENT") console.error("File deletion failed: ", err.message);
      })

    }
    await Booking.deleteMany({ home: homeId });

    await Home.deleteOne({ _id: homeId });

    return res.status(200).json({ success: true, message: "Deleted successfully" })

  } catch (error) {

    console.log(error)
    return res.status(500).json({ success: false, message: "Server error during deletion" });
  }
};
