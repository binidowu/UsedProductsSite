const User = require("../models/user");

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get a user by their ID
exports.getUserById = async (req, res, next) => {
  try {
    req.user = await User.findOne({ _id: req.params.userID }, "-hashedPassword");
    if (!req.user) throw new Error("User not found");
    next();
  } catch (error) {
    next(error);
  }
};

// Update a user
exports.updateUser = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstName", "lastName", "phone", "address", "profilePicture", "bio"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).json({
      success: false,
      message: "Invalid updates!",
    });
  }

  try {
    const userId = req.params.userID;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    // Find the document with the given _id and update it
    let updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true, runValidators: true } // return the updated document instead of the original and run schema validators
    );
    if (!updatedUser) throw new Error("User not updated, are you sure it exists?");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    console.log(user);
    if (!user) throw new Error("User not deleted, are you sure it exists?");
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//Has Authorization
exports.hasAuthorization = (req, res, next) => {
  const authorized = req.auth && req.user && req.auth.id == req.user._id.toString();
  if (!authorized) {
    res.status(403).json({
      success: false,
      message: "User is not authorized to perform this action",
    });
  }
  next();
};
