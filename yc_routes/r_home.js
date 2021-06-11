const express = require('express');
const router = express.Router();

const { catchAsync } = require('../static/js/middleware/errorHandling');

const homeCtrl = require('../Controllers/homeController');

router.route('/')
    .get(catchAsync(homeCtrl.home));

module.exports = router;