let users = require('../models/users');
let config = require('../../config/config');
let jwt = require('jsonwebtoken');
let { expressjwt } = require('express-jwt');

module.exports.signin = async function (req, res, next) {
    try {
        let users = await users.findOne({ "email": req.body.email });
        if (!users)
            throw new Error('users not found.');
        if (!users.authenticate(req.body.password))
            throw new Error("Email and/or password don't match.");

        let payload = {
            id: users._id,
            usersname: users.usersname
        }

        // Generates the token
        let token = jwt.sign(payload, config.SECRETKEY, {
            algorithm: 'HS512',
            expiresIn: "20min"
        })

        // Sends the token in the body of the response to the client.
        res.json(
            {
                success: true,
                token: token
            })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Check the token validation
module.exports.requireSignin = expressjwt({
    secret: config.SECRETKEY,
    algorithms: ['HS512'],
    usersProperty: 'auth'
});

module.exports.hasAuthorization = async function (req, res, next) {
    console.log("Payload", req.auth);
    let authorized = req.auth && req.users && req.auth.usersname == req.users.usersname;

    if (!authorized) {
        return res.status('403').json(
            {
                success: false,
                message: "users is not authorized"
            }
        )
    }
    next();
}