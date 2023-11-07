const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let crypto = require('crypto');

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    hashed_password: {
        type: String,
        required: 'Passowrd is required',
    },
    salt: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updated: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Boolean,
        default: false
    }
},
    {
        collection: "users"
    }
);

UserSchema.virtual('fullName')
    .get(function () {
        ;
    })
    .set(function (fullName) {

    });


UserSchema.virtual('password').set(function (password) {

}
);

UserSchema.methods.hashPassword = function (password) {

}

UserSchema.methods.authenticate = function (password) {

}

module.exports = mongoose.model('User', UserSchema);
