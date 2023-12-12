const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const User = require("../models/user");
const Ad = require("../models/ads");
require("dotenv").config();

const myBck = {
  bucketName: process.env.BUCKET_NAME,
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};
// setting up the s3 client
const s3 = new S3Client({
  region: myBck.region,
  credentials: {
    accessKeyId: myBck.accessKeyId,
    secretAccessKey: myBck.secretAccessKey,
  },
});
// generate a random image name
const randomImageName = (bytes = 32) => {
  return crypto.randomBytes(16).toString("hex");
};

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const { email, username } = req.body; // Fetch email and username values from the req body

    // Check if the email already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) {
      return res.status(409).json({
        succes: false,
        message: "Username already in use",
      });
    }

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
  const allowedUpdates = ["firstName", "lastName", "phone", "address", "profilePicture"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).json({
      success: false,
      message: "Invalid updates!",
    });
  }

  try {
    const userId = req.params.userID;
    const userRetrieved = await User.findById(userId);

    let profilePicture = userRetrieved.profilePicture;
    if (req.file) {
      // If the user uploads a new profile picture, delete the old one from S3 if it exists
      if (userRetrieved.profilePicture) {
        const oldImageName = userRetrieved.profilePicture.split("/").pop();
        const deleteCommand = new DeleteObjectCommand({
          Bucket: myBck.bucketName,
          Key: oldImageName,
        });
        await s3.send(deleteCommand);
      }
      const imageName = crypto.randomBytes(16).toString("hex");
      const command = new PutObjectCommand({
        Bucket: myBck.bucketName,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });
      await s3.send(command);
      profilePicture = `https://${myBck.bucketName}.s3.${myBck.region}.amazonaws.com/${imageName}`;
    }

    const updateData = {
      ...req.body,
      profilePicture,
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
    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        succes: false,
        message: "User not deleted, are you sure it exists?",
      });
    }

    // If the user is found and deleted, then disable all ads associated with the user
    await Ad.updateMany(
      { userId: userId, isActive: true }, // Check that the ad is active when trying to disable it
      { $set: { isActive: false, updatedAt: new Date() } }
    );

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


// Get user information by userID
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userID;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const data = {
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      data: data,
      message: "Done"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}