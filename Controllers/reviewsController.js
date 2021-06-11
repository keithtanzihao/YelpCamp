const campground = require('../yc_models/campground');
const reviews = require('../yc_models/reviews');

module.exports.createReview = async(req, res) => {
    const cg = await campground.findById(req.params.id);
    const review = new reviews(req.body.review);
    review.author = req.user._id;

    cg.reviews.push(review);
    await review.save();
    await cg.save();

    cg.populate('reviews');
    req.flash('success', 'Successfully added a review'); 
    res.redirect(`/yelpCamp/${cg._id}`); 
};

module.exports.deleteReview = async(req, res) => { 
    const { id, reviewId } = req.params;  
    
    await campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });

    const rev = await reviews.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review'); 
    res.redirect(`/yelpCamp/${id}`);
};