const express = require('express');
const sessionController = require('../controllers/sessionController');
const stravaController = require('../controllers/stravaController');
const passport = require('passport');
require('dotenv').config();

const stravaRouter = express.Router();

stravaRouter.get(
  '/strava',
  passport.authenticate('strava', {
    scope: ['profile:read_all,activity:read_all'],
  })
);
stravaRouter.get('/error', (req, res, next) => {
  return res.send('Error in Strava Auth');
});
stravaRouter.get('/success', (req, res, next) => {
  return res.send('success in Strava Auth');
});

stravaRouter.get(
  '/strava/callback',
  passport.authenticate('strava', { failureRedirect: '/error' }),
  stravaController.syncStrava,
  (req, res, next) => {
    // console.log(req.session);›
    // const id = encodeURIComponent(`${req.user.id}`);
    // const token = encodeURIComponent(`${req.user.token}`);
    // return res.redirect(
    //   `http://localhost:8080/authenticate/?id=${id}&token=${token}`
    // );
    res.status(200).redirect('http://localhost:8080/');
  }
);

stravaRouter.get(
  '/update',
  sessionController.isLoggedIn,
  stravaController.getRides,
  (req, res, next) => {
    return res.status(200).send(res.locals.user);
  }
);
module.exports = stravaRouter;
