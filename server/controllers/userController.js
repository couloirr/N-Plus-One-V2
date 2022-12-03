const { User } = require('../models/userModel');

const userController = {};

userController.getUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const currentUser = await User.findOne({ email: email });
    if (currentUser.password === password) {
      res.locals.user = currentUser;
      return next();
    } else {
      return next({
        message: 'invalid password',
      });
    }
  } catch (err) {
    next({
      log: `error in User Controller: ${err}`,
      status: 500,
      message: 'error occurred in user controller while getting user',
    });
  }
};
userController.createUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const currentUser = await User.create({
      email: email,
      password: password,
    });
    res.locals.user = currentUser;
    return next();
  } catch (err) {
    next({
      log: `error in User Controller: ${err}`,
      status: 500,
      message: 'error occurred in user controller while creating user',
    });
  }
};

module.exports = userController;
