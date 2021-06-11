const express = require('express');
const router = express.Router();

// Middleware Helper Functions
const { catchAsync } = require('../static/js/middleware/errorHandling');
const { isLoggedIn, cgAuth } = require('../static/js/middleware/authValidation');
const { validateCampground } = require('../static/js/middleware/schemaValidation');

// Controller Functions
const cgCtrl = require('../Controllers/campgroundsController');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

// NOTE: Refer to router.route(path) Express Docs 
// file:///C:\Users\keith\Desktop\udemy_WebDevBC\yelpCamp\Docs\router.route

// Get Homepage / Create Camp
router.route('/')
    .get(catchAsync(cgCtrl.index))
    .post(isLoggedIn, upload.array('img'), validateCampground, catchAsync(cgCtrl.createCamp));
    
    
// Add New Campground Info 
// NOTE: Order matters in this case. 
router.get('/new', isLoggedIn, cgCtrl.createCampForm);


// Get Indiv Camp Info / Edit Camp Info / Delete Camp 
router.route('/:id')
    .get(catchAsync(cgCtrl.fetchCamp))
    .put(isLoggedIn, cgAuth, upload.array('img'), validateCampground, catchAsync(cgCtrl.editCamp))
    .delete(isLoggedIn, cgAuth, catchAsync(cgCtrl.deleteCamp));


// Editing Individual Campground Info
router.get('/:id/edit', isLoggedIn, cgAuth, catchAsync(cgCtrl.editCampForm));


module.exports = router;