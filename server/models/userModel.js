const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();
mongoose
  .connect(process.env.MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'NPlusOneUsers',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));
/////defaults
const bikeDataDefault = {
  bikeName: 'Your Bike',
  bikeIconName: 'mtb',
  bikeDistance: 0,
  bikeElevation: 0,
  bikeMovingTime: 0,
};
const partDefault = [
  {
    partName: 'Fork',
    partIconName: 'fork',
    partDistance: 0,
    partMovingTime: 0,
    serviceIntervals: [
      {
        intervalName: 'Full Service',
        intervalLength: 125,
        intervalUnit: 'hours',
        timeRemaining: 125,
        serviceHistory: [],
      },
      {
        intervalName: 'Air pressure',
        intervalLength: 1,
        intervalUnit: 'month',
        timeRemaining: 1,
        serviceHistory: [],
      },
    ],
  },
  {
    partName: 'Rear Shock',
    partIconName: 'rear shock',
    partDistance: 0,
    partMovingTime: 0,
    serviceIntervals: [],
  },
];
const serviceIntervalDefault = {
  intervalName: 'Full Service',
  intervalLength: 100,
  intervalUnit: 'hours',
  timeRemaining: 100,
  serviceHistory: [],
};

const rideDefault = [
  {
    rideName: 'Sample Ride',
    rideElevation: 1000,
    rideDistance: 10,
    rideTime: 1.5,
  },
];
const serviceSchema = new Schema({
  intervalName: String,
  intervalLength: Number,
  intervalUnit: String,
  timeRemaining: Number,
  serviceHistory: [],
});
const partSchema = new Schema({
  partName: String,
  partIconName: String,
  partDistance: Number,
  partMovingTime: Number,
  serviceIntervals: { type: [serviceSchema], default: serviceIntervalDefault },
});
const rideSchema = new Schema({
  rideName: String,
  rideElevation: Number,
  rideDistance: Number,
  rideTime: Number,
});

//User Schema
const userSchema = new Schema({
  stravaId: Number,
  email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
  password: String,
  lastSignIn: Date,
  token: Number,
  bikeData: {
    bikeName: { type: String, default: 'Your Bike' },
    bikeIconName: { type: String, default: 'mtb' },
    bikeDistance: { type: Number, default: 0 },
    bikeElevation: { type: Number, default: 0 },
    bikeMovingTime: { type: Number, default: 0 },
  },
  parts: { type: [partSchema], default: partDefault },
  rides: { type: [rideSchema], default: rideDefault },
});

const User = mongoose.model('user', userSchema);

module.exports = { User };
