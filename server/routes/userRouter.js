const express = require('express');
const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post(
  '/login',
  userController.getUser,
  sessionController.startSession,
  (req, res, next) => {
    return res.status(200).send(res.locals.user);
  }
);
userRouter.post(
  '/register',
  userController.createUser,
  sessionController.startSession,
  (req, res, next) => {
    return res.status(200).send(res.locals.user);
  }
);

//handles strava update and ssid verification
userRouter.get('/verify', sessionController.isLoggedIn, (req, res, next) => {
  return res.status(200).send(res.locals.user);
});
module.exports = userRouter;
