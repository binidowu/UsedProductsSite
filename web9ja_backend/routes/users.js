const { requireSignin, hasAuthorization } = require('../controllers/auth');
let express = require('express');
let router = express.Router();

let usersController = require('../controllers/users');

router.post('/register', usersController.register);
router.post('/signin', usersController.signin);
router.get('/:userID', usersController.account);

router.put('/update/:userID',
    requireSignin,
    hasAuthorization,
    usersController.updateAccount,
);

// View a user's list of saved ads
router.get('/:userID/favourites', requireSignin, usersController.SavedAd);

// Add an ad to a user's saved
router.put('/:userID/favourites/:adID', requireSignin, usersController.addSavedAd);

// Delete a user account
router.delete('/delete/:userID',
    requireSignin,
    hasAuthorization,
    usersController.deleteAccount, // This should be a method that handles account deletion
);

// List all ads posted by a specific user
router.get('/:userID/ads', requireSignin, usersController.userAds);

module.exports = router;
