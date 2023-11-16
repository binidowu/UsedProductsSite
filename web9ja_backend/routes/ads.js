const { requireSignin } = require("../controllers/auth");

let express = require("express");
let router = express.Router();

let adsController = require("../controllers/ads");

router.post('/', requireSignin, adsController.createAd); // Post a new ad
router.put('/:adID', requireSignin, adsController.isOwner, adsController.editAd); // Edit a specific ad
router.get('/', adsController.viewAds); // View all ads
router.put('/:adID/disable', requireSignin, adsController.isOwner, adsController.disableAd);// Toggle staus of a specific ad
router.post('/:adID/questions', adsController.askQuestion); //asking a question on an ad.
router.post('/:adID/questions/:questionID/answer', requireSignin, adsController.isOwner, adsController.answerQuestion); // answering a question on an ad

module.exports = router;
