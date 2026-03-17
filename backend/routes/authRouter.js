const express = require('express')
const authRouter = express.Router();
const authController = require('../controllers/authController.js');
const { signupValidator } = require('../validators/signupValidator.js');
const { isAuth } = require('../middlewares/isAuth.js');

authRouter.get("/session-user", authController.getSessionUser)


authRouter.post("/signup", signupValidator, authController.postSignup);
authRouter.post("/login", authController.postLogin);

authRouter.post("/logout", isAuth, authController.postLogOut);
authRouter.delete("/delete-user", isAuth, authController.deleteUser)
module.exports = authRouter

