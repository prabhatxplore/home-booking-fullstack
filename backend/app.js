// External Module
const express = require("express");
const path = require("path");
const session = require("express-session")
const MongoStore = require('connect-mongo').default;
const multer = require("multer")
require('dotenv').config();
const crypto = require("crypto");
const cors = require("cors")

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const HOST = process.env.HOST
// Env variavles


// Local Module
const homeRouter = require("./routes/storeRouter.js");
const hostRouter = require("./routes/hostRouter.js");
const authRouter = require("./routes/authRouter.js")
const rootDir = require("./utils/pathUtil.js");
const { pageNotFound } = require("./controllers/errors.js");
const mongoose = require('mongoose');

const { isTrustedIP } = require("./middlewares/isTrustedIP.js");
const favouriteRouter = require("./routes/favouriteRouter.js");
const bookingRouter = require("./routes/bookingRouter.js");
const { webHookRouter, paymentRouter } = require("./routes/paymentRouter.js");


const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// Store
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  collectionName: "sessions",
  ttl: 60 * 60 * 24
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(11).toString("hex") + "-" + file.originalname)
  }
})


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
app.use((req, res, next) => {
  console.log(req.url)
  next()
})
// app.use(isTrustedIP)

app.use(cors({
  origin: (origin, callback) => {
    console.log("This is Origin", origin)
    if (!origin) return callback(null, true)
    if (["http://localhost:5173","https://votable-kaylee-exocentric.ngrok-free.dev"].includes(origin)) {
      console.log("im here")
      return callback(null, true)
    }

    else {
      callback(new Error("Not allowed by CORS"))
    }
  }, // your React dev server
  credentials: true              // allow cookies
}));

app.use(express.urlencoded({ extended: true }));
app.use("/api", webHookRouter)
app.use(express.json())
app.use(multer({ storage, fileFilter }).single('photo'))
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24

  }
}))

store.on("error", err => console.log(err))


app.use("/api", authRouter)
app.use("/api/host", hostRouter);
app.use("/api/favourites", favouriteRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/payment", paymentRouter)
app.use("/api", homeRouter)

// 404 error routing
app.use(pageNotFound);




mongoose.connect(MONGO_URL).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, HOST, () => {
    console.log(`server is listening on http://${HOST}:${PORT}`);
  });
}).catch(err => {
  console.log('error connecting mongo :  ', err)

});