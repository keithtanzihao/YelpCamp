const express = require('express');
const router = express.Router();

const { catchAsync } = require('../static/js/middleware/errorHandling');
const { validateReviews } = require('../static/js/middleware/schemaValidation');
const { isLoggedIn, reviewAuth } = require('../static/js/middleware/authValidation');

const reviewCtrl = require('../Controllers/reviewsController');


// Add Review Campground
router.post('/:id/reviews', isLoggedIn, validateReviews, catchAsync(reviewCtrl.createReview));


// Delete Campground Related Review
router.delete('/:id/reviews/:reviewId', isLoggedIn, reviewAuth, catchAsync(reviewCtrl.deleteReview));


module.exports = router;