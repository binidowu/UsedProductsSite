const { requireSignin, hasAuthorization } = require('../controllers/auth');

let express = require('express');
let router = express.Router();

let questionsController = require('../controllers/questions');

router.get('/ads/:adID', questionsController.viewQuestion); // View all questions for a specific ad
router.post('/ads/:adID', questionsController.askQuestion); // Post a question for a specific ad
router.put(
    '/ads/:adID/:questionId',
    requireSignin,
    hasAuthorization,
    questionsController.questionResponse
); // Respond to a specific question for a specific ad

module.exports = router;
