// Exporting the MongoDB Atlas connection string
require('dotenv').config()

module.exports = {
    "SECRET_KEY": process.env.SECRET_KEY,
    "ATLASDB": process.env.ATLASDB
};