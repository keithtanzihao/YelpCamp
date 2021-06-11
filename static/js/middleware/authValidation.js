const campground = require('../../../yc_models/campground');
const reviews = require('../../../yc_models/reviews');
const passport = require('passport');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'User Must Sign In First !');
        return res.redirect('/login');
    }
    next();
}

module.exports.cgAuth = async (req, res, next) => {

    let cg = await campground.findById(req.params.id);

    if (!(cg.author == req.user.id)) {    
        req.flash('error', 'Invalid Permission');
        return res.redirect(`/yelpCamp/${cg._id}`);
    }
    next();
}

module.exports.userAuth = (req, res, next) => {
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' })(req, res, next);
};

module.exports.reviewAuth = async (req, res, next) => {
    
    let review = await reviews.findById(req.params.reviewId);

    if (!(review.author == req.user.id)) {
        req.flash('error', 'Invalid Permission');
        return res.redirect(`/yelpCamp/${req.params.id}`);
    }
    next();
}