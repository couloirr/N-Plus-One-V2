const Session = require('../models/sessionModel');
const { User } = require('../models/userModel');
const sessionController = {};

/**
 * isLoggedIn - find the appropriate session for this request in the database, then
 * verify whether or not the session is still valid.
 */
sessionController.isLoggedIn = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.ssid;
    console.log(req.cookies.ssid, 'cookies');
    // const userId = await Session.findOne({ cookieId: sessionCookie });
    const user = await User.findById({ _id: req.cookies.ssid });
    res.locals.user = user || false;
    return next();
  } catch (err) {
    return next({
      log: `error in Session Controller: ${err}`,
      status: 500,
      message: 'error occurred in session controller while verifying session',
    });
  }
};

/**
 * startSession - create and save a new Session into the database.
 */
sessionController.startSession = async (req, res, next) => {
  const options = {
    secure: true,
    httpOnly: true,
  };
  try {
    // Session.create({ cookieId: res.locals.user._id });
    res.cookie('ssid', res.locals.user._id, options);
    return next();
  } catch (err) {
    return next({
      log: `error in Session Controller: ${err}`,
      status: 500,
      message: 'error occurred in session controller while starting session',
    });
  }
};

module.exports = sessionController;
