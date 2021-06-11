const express = require('express');
const path = require('path');
const router = express.Router();

// NOTE: Order of route scirpts seems to make a difference
router.use('/', require('./r_home'));
router.use('/yelpCamp', require('./r_campground'));
router.use('/yelpCamp', require('./r_reviews'));
router.use('/', require('./r_user'));

module.exports = router;