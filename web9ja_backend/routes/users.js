let express = require("express");
const multer = require("multer");
let router = express.Router();

//import the controllers
let userController = require("../controllers/users");
let auth = require("../controllers/auth");

//To register users
router.post("/register", userController.createUser);
//To sign in users...after signing in, the client is given a token that is used to access protected routes and also the user detalils are sent back to the client.
router.post("/login", auth.signin);

//A middle ware to get user id and fetch the user from the database and attach it to the req object that will be used by the next middle ware.
router.param("userID", userController.getUserById);

//To update a user, the requireSignIn automatically gets the token "access_token" property. and verifies it. if truthy, it retutns the payload(user id and username) in the req.auth property.
//The hasAuthorization middle ware checks if the user id in the req.auth property is the same as the user id in the req.user property. if truthy, it allows the user to update the user details.
const upload = multer({ storage: multer.memoryStorage() });
router.put("/update/:userID", auth.requireSignin, userController.hasAuthorization, upload.single("picture"), userController.updateUser);

// To delete a user account, we perform the same checks as the update route before deleting the user account.
router.delete("/delete/:userID", auth.requireSignin, userController.hasAuthorization, userController.deleteUser);

// To get user information by userID
router.get("/user/:userID", userController.getUser);

module.exports = router;
