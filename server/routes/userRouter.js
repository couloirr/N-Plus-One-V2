const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post('/login', userController.getUser, (req, res, next) => {
  return res.status(200).send(res.locals.user);
});
userRouter.post('/register', userController.createUser, (req, res, next) => {
  return res.status(200).send(res.locals.user);
});

module.exports = userRouter;
