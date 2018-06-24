"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, err => {
        callback(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {

      //original function given to us sorts oldest first - fixed so that behavior fits function name
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      db.collection("tweets").find({}).toArray((err, tweets) => {
        callback(null, tweets.sort(sortNewestFirst));
      });
    }
  };
}
