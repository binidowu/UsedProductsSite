const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
let Ad = require("../models/ads");
let User = require("../models/user");
require("dotenv").config();

/*
@ayo, please configure the below credetials with environment variables
dont delete just set the bucket name to the env.variable etc
e.g
const myBck = {
  bucketName: env.BUCKET_NAME,
  region: env.REGION,
  accessKeyId: env.ACCESS_KEY_ID,
  secretAccessKey: env.SECRET_ACCESS_KEY,
};
and dont forget to include the credetials on render.
 */
const myBck = {
  bucketName: env.BUCKET_NAME,
  region: env.REGION,
  accessKeyId: env.ACCES_KEY_ID,
  secretAccessKey: env.SECRET_ACCESS_KEY,
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

// Create a new ad
module.exports.createAd = async (req, res, next) => {
  // create a new array to hold the urls of the uploaded images
  const pictureUrls = [];
  try {
    const userId = req.auth.id;
    if (userId != req.body.userId) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to perform this action",
      });
    }

    // Process and upload files to S3

    // loop through the files and upload them to s3
    for (const file of req.files) {
      const imageName = randomImageName(); // Ensure this generates a unique name for each image
      const command = new PutObjectCommand({
        Bucket: myBck.bucketName,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await s3.send(command);
      const imageUrl = `https://${myBck.bucketName}.s3.${myBck.region}.amazonaws.com/${imageName}`;
      pictureUrls.push(imageUrl);
    }

    //Saving the ad and stored images to the database
    //Create and  Add picture URLs to adDetails
    const adDetails = { ...req.body, userId, pictures: pictureUrls };
    const newAd = await Ad.create(adDetails);

    // Fetch the user and attach the newly created ad ID to the postedAds array.
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.postedAds.push(newAd._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Ad created successfully",
      data: newAd,
    });
  } catch (error) {
    // Delete the removed images from S3
    for (const imageUrl of pictureUrls) {
      const imageKey = imageUrl.split("/").pop();
      const deleteCommand = new DeleteObjectCommand({
        Bucket: myBck.bucketName,
        Key: imageKey,
      });
      await s3.send(deleteCommand);
    }

    next(error);
  }
};

// Edit an ad
exports.editAd = async (req, res, next) => {
  try {
    const adId = req.params.adID;
    const userId = req.auth.id;
    const ad = await Ad.findById(adId);

    if (ad.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "User not authorized to edit this ad" });
    }

    // Process new images (if any) and upload to S3
    const newImageUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const imageName = crypto.randomBytes(16).toString("hex");
        const command = new PutObjectCommand({
          Bucket: myBck.bucketName,
          Key: imageName,
          Body: file.buffer,
          ContentType: file.mimetype,
        });
        await s3.send(command);
        newImageUrls.push(`https://${myBck.bucketName}.s3.${myBck.region}.amazonaws.com/${imageName}`);
      }
    }

    // Identify removed images and delete from S3
    let retainedImages;
    if (Array.isArray(req.body.retainedPictures)) {
      retainedImages = req.body.retainedPictures;
    } else if (typeof req.body.retainedPictures === "string") {
      retainedImages = [req.body.retainedPictures];
    } else {
      retainedImages = [];
    }

    // Find the images that were removed
    const removedImages = ad.pictures.filter((url) => !retainedImages.includes(url));
    // Delete the removed images from S3
    for (const imageUrl of removedImages) {
      const imageKey = imageUrl.split("/").pop();
      const deleteCommand = new DeleteObjectCommand({
        Bucket: myBck.bucketName,
        Key: imageKey,
      });
      await s3.send(deleteCommand);
    }

    // Update ad with new list of images
    ad.pictures = [...retainedImages, ...newImageUrls];
    ad.category = req.body.category || ad.category;
    ad.description = req.body.description || ad.description;
    ad.price = req.body.price || ad.price;
    ad.endAt = req.body.endAt || ad.endAt;
    ad.updatedAt = new Date();

    const updatedAd = await ad.save();

    if (!updatedAd) throw new Error("Ad not updated, are you sure it exists?");
    res.status(200).json({
      success: true,
      message: "Ad updated successfully",
      data: updatedAd,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// View all active ads
exports.viewAds = async (req, res, next) => {
  try {
    const ads = await Ad.find({}); // Fetch all ad documents from the database

    // Send the ads back to the client.
    res.status(200).json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Toggle ad status
exports.disableAd = async (req, res, next) => {
  try {
    const adId = req.params.adID;
    const userId = req.auth.id;

    const updatedAd = await Ad.findOneAndUpdate(
      { _id: adId, userId: userId, isActive: true }, // Check that the ad is active when trying to disable it
      { $set: { isActive: false, updatedAt: new Date() } },
      { new: true, runValidators: true } // return the updated document instead of the original and run schema validators
    );

    if (!updatedAd) throw new Error("Ad not disabled, are you sure it exists?");

    // Send the updated ad back to the client.
    res.status(200).json({
      success: true,
      message: "Ad disabled successfully",
      data: updatedAd,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.isOwner = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.adID);

    // Check if the ad exists and if the logged-in user is the owner of the ad
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    } else if (ad.userId.toString() != req.auth.id) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to perform this action",
      });
    }

    // if the user is authorized, attach the ad to the req object and proceed
    req.ad = ad;
    next();
  } catch (error) {
    next(error);
  }
};

// Questions and responses
exports.askQuestion = async (req, res, next) => {
  try {
    const adId = req.params.adID;
    const questionText = req.body.questionText;
    const askedBy = req.body.askedBy;

    // Check if the ad is active
    const ad = await Ad.findOne({ _id: adId, isActive: true });

    if (!ad) throw new Error("Ad is no longer active or not found");

    // Create a new question object
    const question = {
      questionText: questionText,
      askedBy: askedBy || "", // If user is anonymous it'll be undefined
    };

    // Add the new question to the ad's questions array
    ad.questions.push({
      questionText: questionText,
      askedBy: askedBy || " ",
    });

    //save the changes to the ad
    const updatedAd = await ad.save();

    // Send the updated ad back to the client, along with the new question
    res.status(200).json({
      success: true,
      message: "Question posted succesfully",
      ad: updatedAd,
      question: question,
    });
  } catch (error) {
    next(error);
  }
};

exports.answerQuestion = async (req, res, next) => {
  try {
    const adId = req.params.adID;
    const questionId = req.params.questionID;
    const userId = req.auth.id;
    const answerText = req.body.answerText;

    // Fetch the ad, ensure it's active and the user is the owner
    const ad = await Ad.findOne({ _id: adId, userId: userId, isActive: true });

    if (!ad) throw new error("Ad not found, not active, or user not authorized to answer");

    // Find the question within the ad
    const question = ad.questions.id(questionId);
    console.log("Question found:", question);
    if (!question) res.status(404).json({ success: false, message: "Question not found" });

    if (question.answerText)
      return res.status(403).json({
        success: false,
        message: "Question already answered",
      });

    if (!answerText) res.status(400).json({ success: false, message: "Answer is required" });

    // Set the answer and save the ad
    question.answerText = answerText;
    await ad.save();

    res.status(200).json({
      success: true,
      message: "Question answered succesfully",
      ad: ad,
      question: question,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleFavoriteAd = async (req, res, next) => {
  try {
    const adId = req.params.adID;
    const userId = req.auth.id;

    // Fetch the user
    const user = await User.findById(userId);

    if (req.params.userID != userId) res.status(403).json({ success: false, message: "User is not authorized to perform this action" });

    if (!user) throw new Error("User not found");

    // Check if the ad is already in the user's favorites
    const isFavorite = user.favorites.includes(adId);

    if (isFavorite) {
      // Remove the ad from the user's favorites
      user.favorites.pull(adId);
      await user.save();
      res.status(200).json({
        success: true,
        message: "Ad removed from favorites",
        user: user,
      });
    } else {
      // Add the ad to the user's favorites
      user.favorites.push(adId);
      await user.save();
      res.status(200).json({
        success: true,
        message: "Ad added to favorites",
        user: user,
      });
    }
  } catch (error) {
    next(error);
  }
};
