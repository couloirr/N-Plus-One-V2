const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const stravaRouter = require('./routes/stravaRouter');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  return next();
});
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'running a marathon',
    resave: false,
    saveUninitialized: true,
  })
);

// app.use('/client', express.static(path.resolve(__dirname, '../client')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', userRouter);
app.use('/auth', stravaRouter);
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));

app.use((req, res) =>
  res.status(404).sendFile(path.join(__dirname, '../client/index.html'))
);

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
