let User = require("../models/user");
let config = require("../../config/config");
let jwt = require("jsonwebtoken");
let { expressjwt } = require("express-jwt");

module.exports.signin = async function (req, res, next) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("users not found.");
    const res = await user.authenticate(req.body.password);
    if (!res) throw new Error("Email and/or password don't match.");

    let payload = {
      id: user._id,
      username: user.username,
    };

    // Generates the token
    let token = jwt.sign(payload, config.SECRET_KEY, {
      algorithm: "HS512",
      expiresIn: "1d",
    });

    // convert the Mongoose document into a plain JavaScript object
    const userObject = user.toObject();
    //Extacting the user details that wouldnt be sent to the client.
    const { hashedPassword, updatedAt, ...userDetails } = userObject;

    // Sends the token in the body of the response to the client along with the user details.
    res.json({
      success: true,
      token: token,
      message: "users logged in successfully",
      addInfo: "save the token in the client side (cookies) and send it in the header for all requests that require authentication",
      user: userDetails,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Check the token validation
module.exports.requireSignin = expressjwt({
  secret: config.SECRET_KEY,
  algorithms: ["HS512"],
  userProperty: "auth", //corrected property name
});
