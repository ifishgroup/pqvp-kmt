/* eslint-disable */
const mongoose = require('mongoose');

var connectWithRetry = function () {
  return mongoose.connect(process.env.MONGODB_URI, err => {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();

module.exports = { mongoose };
