const { requireSignin, hasAuthorization } = require("../controllers/auth");

let express = require("express");
let router = express.Router();

let adsController = require("../controllers/ads");
/*
router.get('/', adsController.viewAds); // View all ads
router.post('/', requireSignin, adsController.createAd); // Post a new ad
router.put('/:adID', requireSignin, hasAuthorization, adsController.editAd); // Edit a specific ad
router.put('/:adID/toggle-status', requireSignin, hasAuthorization, adsController.adStatus); 
// Toggle staus of a specific ad

*/
module.exports = router;
