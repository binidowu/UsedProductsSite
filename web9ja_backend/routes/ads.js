const { requireSignin } = require("../controllers/auth");

let express = require("express");
let router = express.Router();

let adsController = require("../controllers/ads");

// Post a new ad
router.post("/", requireSignin, adsController.createAd);

// Edit a specific ad
router.put("/:adID", requireSignin, adsController.isOwner, adsController.editAd);

// View all ads
router.get("/", adsController.viewAds);

// Toggle staus of a specific ad
router.put("/disable/:adID", requireSignin, adsController.isOwner, adsController.disableAd);

//asking a question on an ad.
router.post("/questions/:adID", adsController.askQuestion);

// answering a question on an ad
router.post("/questions/:adID/answer/:questionID", requireSignin, adsController.isOwner, adsController.answerQuestion);

//add or remove ad from favorites
router.put("/favorites/:userID/:adID", requireSignin, adsController.toggleFavoriteAd);

module.exports = router;
