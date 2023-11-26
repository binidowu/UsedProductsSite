let Ad = require("../models/ads");
let User = require("../models/user");

// Create a new ad
module.exports.createAd = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    //@Ayo, we have to check if the user that is signed in is the same as the user that is creating the ad...without this implementation, anyone can create an ad for any user.
    if (userId != req.body.userId) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to perform this action",
      });
    }
    const adDetails = { ...req.body, userId };
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
    next(error);
  }
};

// Edit an ad
exports.editAd = async (req, res, next) => {
  const updates = Object.keys(req.body); // extract property names from the client req
  //why do we have question and isActive here? we dont want the user to be able to edit these fields.
  const allowedUpdates = ["category", "description", "price", "pictures", "endAt"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update)); // checks if a key updates can be updated

  if (!isValidOperation) {
    res.status(400).json({
      success: false,
      message: "Invalid field for update",
    });
  }

  try {
    const adId = req.params.adID;
    const userId = req.auth.id;
    const updatedData = {
      // The updated fields from the frontend
      ...req.body,
      updatedAt: new Date(),
    };
    console.log("Updating ad with ID:", adId, "for user ID:", userId);
    const updatedAd = await Ad.findOneAndUpdate(
      { _id: adId, userId: userId },
      { $set: updatedData },
      { new: true, runValidators: true } // return the updated document instead of the original and run schema validators
    );

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
