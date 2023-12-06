const { requireSignin } = require("../controllers/auth");
const multer = require("multer");

let express = require("express");
let router = express.Router();

let adsController = require("../controllers/ads");

// Post a new ad
const upload = multer({ storage: multer.memoryStorage() });
router.post("/", requireSignin, upload.array("pictures", 5), adsController.createAd);

// Edit a specific ad
router.put("/:adID", requireSignin, adsController.isOwner, upload.array("pictures", 5), adsController.editAd);

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
