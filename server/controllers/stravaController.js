const { User } = require('../models/userModel');
const passport = require('passport');
const StravaStrategy = require('@riderize/passport-strava-oauth2').Strategy;
const stravaController = {};
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new StravaStrategy(
    {
      clientID: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      callbackURL: process.env.STRAVA_CALLBACK,
    },
    async function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
stravaController.isLoggedIn = (req, res, next) => {
  if (!req.user || !req.isAuthenticated())
    return res.status(401).json('Error: User not authorized');
  return next();
};
stravaController.syncStrava = async (req, res, next) => {
  const userId = req.cookies.ssid;
  const token = req.user.token;
  try {
    const query = { _id: userId };
    const update = { token: token };
    const options = { new: true };
    const user = await User.findOneAndUpdate(query, update, options);
    res.locals.user = user;

    return next();
  } catch (err) {
    return next({
      log: `error in auth controller addUser: ${err}`,
      status: 500,
      message: 'error occurred in strava controller sync Strava',
    });
  }
};

module.exports = stravaController;
// GET Rides
//processes Strava data and sends to bike controller on synced account login
//accepts userid

//Sync Stava
//Syncs a new Strava account to user db
//accepts userid
