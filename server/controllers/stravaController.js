const { User } = require('../models/userModel');
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const StravaStrategy = require('@riderize/passport-strava-oauth2').Strategy;
const stravaApi = require('strava-v3');
const stravaController = {};
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
// passport.use(
//   new StravaStrategy(
//     {
//       clientID: process.env.STRAVA_CLIENT_ID,
//       clientSecret: process.env.STRAVA_CLIENT_SECRET,
//       callbackURL: process.env.STRAVA_CALLBACK,
//     },
//     async function (accessToken, refreshToken, profile, done) {
//       console.log(accessToken);
//       console.log(refreshToken);
//       return done(null, profile);
//     }
//   )
// );
const strategy = new StravaStrategy(
  {
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: process.env.STRAVA_CALLBACK,
  },
  async function (accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    // const userId = req.cookies.ssid;
    // const options = { new: true };
    // const update = { token: refreshToken };
    // const user = await User.findOneAndUpdate(query, update, options);
    // res.locals.user = user;
    // return done(null, profile);
    return done(null, refreshToken);
  }
);

passport.use('strava', strategy);
refresh.use(strategy);
stravaController.isLoggedIn = (req, res, next) => {
  if (!req.user || !req.isAuthenticated())
    return res.status(401).json('Error: User not authorized');
  return next();
};
//Sync Stava
//Syncs a new Strava account to user db
//accepts userid
stravaController.syncStrava = async (req, res, next) => {
  const userId = req.cookies.ssid;
  const token = req.user;

  console.log(req.user, 'req user');
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

stravaController.getRides = async (req, res, next) => {
  try {
    const userDoc = res.locals.user;
    const token = await refresh.requestNewAccessToken(
      'strava',
      userDoc.token,
      async function (err, accessToken, refreshToken) {
        console.log(accessToken);
        const strava = new stravaApi.client(accessToken);
        const options = {};
        if (userDoc.lastSignIn) {
          options.before = userDoc.lastSignIn;
        }
        const userActivities = await strava.athlete.listActivities(options);
        console.log(userActivities);
        res.locals.user = userActivities;
        return next();
      }
    );
  } catch (err) {
    next({
      log: `error in strava controller Fetch: ${err}`,
      status: 500,
      message: 'error occurred in strava controller while fetching athlete',
    });
  }
};

function processRides(ridesArr) {}
