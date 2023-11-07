// Importing necessary configurations for the database
let config = require('./config');

// Importing mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Function to set up the MongoDB connection
module.exports = function () {
    // Connecting to MongoDB using the connection string from the config
    mongoose.connect(config.ATLASDB);

    // Creating a connection instance
    let mongodb = mongoose.connection;

    // Handling connection errors
    mongodb.on('error', console.error.bind(console, 'Connection Error: '));

    // Logging successful database connection
    mongodb.once('open', () => {
        console.log("====> Connected to MongoDB.");
    });

    // Returning the database connection instance
    return mongodb;
}
