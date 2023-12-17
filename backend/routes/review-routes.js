const express = require('express');

const reviewController = require('../controllers/review-controllers');
const {verifyToken} = require("../controllers/users-controller");

const router = express.Router();

router.get('/:rid', reviewController.getReviewById);

router.get('/user/:uid', reviewController.getReviewsByUserId);

router.get('/user/:pid', reviewController.getReviewsBySummaryId);

// position is important!!!! block all the requests comming to below without token
router.use(verifyToken);

router.post('/', reviewController.createReview);

router.patch('/:rid', reviewController.updateReview);

router.delete('/:rid', reviewController.deleteReview);

module.exports = router;