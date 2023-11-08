let UserModel = require('../models/users');

module.exports.register = async (req, res, next) => {

    try {
        let newUser = new UserModel(req.body);

        let result = await UserModel.create(newUser);
        res.json(
            {
                success: true,
                message: "User registeration successfull."
            });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports.signin = async (req, res, next) => {

    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports.account = async (req, res, next) => {

    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports.updateAccount = async (req, res, next) => {

    try {
        let userId = req.params.userID;
        let updatedUser = UserModel(req.body);
        updatedUser._id = userId;

        let result = await UserModel.updateOne({ _id: userId }, updatedUser);
        console.log(result);
        if (result.modifiedCount === true) {
            res.json(
                {
                    success: true,
                    message: "User detail updated successfully."
                }
            );
        }
        else {
            throw new Error('User detail not updated.')
        }
    } catch (error) {
        console.log(error);
        next(error)}
}
module.exports.SavedAd = async (req, res, next) => {

    try {
        let addedAd = new UserModel(req.body);
        let userId = req.params.userID;
        let add = await UserModel({addedAd, savedBy: userId});
        console.log(add);
        res.json(
            {
                success: true,
                message: "Ad saved successfully.",
            }
        );

    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports.addSavedAd = async (req, res, next) => {

    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports.userAds = async (req, res, next) => {

    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports.disableAccount = async (req, res, next) => {
    try {
        let userId = req.params.userID;

        let result = await UserModel.updateOne(
            { _id: userId },     { $set: { isDisabled: true } }
        );

        if (result.nModified === true) {
            res.json({
                success: true,
                message: "User account disabled successfully."
            });
        } else {
            throw new Error('User account not disabled.');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}
