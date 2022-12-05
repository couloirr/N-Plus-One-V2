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
        // console.log(userActivities);
        const data = dataReducer(userActivities);
        userDoc.rides.push(...data.rides);
        userDoc.bikeData.bikeDistance += data.totals.totalMiles;
        userDoc.bikeData.bikeElevation += data.totals.elevationGain;
        userDoc.bikeData.bikeMovingTime += data.totals.movingTime;
        const update = await userDoc.save();
        res.locals.user = update;
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

function dataReducer(data) {
  let totalsObj = {
    totalMiles: 0,
    movingTime: 0,
    elevationGain: 0,
  };
  const round = (num) => Math.round(num * 10) / 10;
  const ridesArr = [];
  data.forEach((el) => {
    const { distance, moving_time, elapsed_time, total_elevation_gain, name } =
      el;
    if (el.type === 'Ride') {
      totalsObj.totalMiles += round(distance / 1609);
      totalsObj.movingTime += round(moving_time / 2600);
      totalsObj.elevationGain += round(total_elevation_gain * 3.281);
      ridesArr.push({
        rideName: name,
        rideElevation: round(total_elevation_gain * 3.281),
        rideDistance: round(distance / 1609),
        rideTime: round(elapsed_time / 2600),
      });
    }
  });
  totalsObj.movingTime = Math.round(totalsObj.movingTime * 10) / 10;
  totalsObj.elevationGain = Math.round(totalsObj.elevationGain * 10) / 10;
  return { totals: totalsObj, rides: ridesArr };
}
