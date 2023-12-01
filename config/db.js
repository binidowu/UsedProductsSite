// Importing necessary configurations for the database
let config = require('./config');

// Importing mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Export a function that, when called, will attempt to connect to MongoDB and return a promise.
module.exports = function () {
    // Return a new promise object.
    return new Promise((resolve, reject) => {
        // Use Mongoose to connect to MongoDB using the connection string provided in the config.
        // The options `useNewUrlParser` and `useUnifiedTopology` are there for the new URL parser and to use the new topology engine.
        mongoose.connect(config.ATLASDB, { useNewUrlParser: true, useUnifiedTopology: true });

        // Get the default connection object.
        let mongodb = mongoose.connection;

        // Attach an error event listener to the connection. If an error occurs, it will log the error and reject the promise.
        mongodb.on('error', (err) => {
            console.error('Connection Error: ', err);
            reject(err); // Reject the promise with the error object.
        });

        // Attach an 'open' event listener to the connection. This event is emitted when Mongoose successfully connects to MongoDB.
        mongodb.once('open', () => {
            console.log("====> Connected to MongoDB."); // Log a message indicating a successful connection.
            resolve(mongodb); // Resolve the promise with the connection object, indicating success.
        });
    });
};