const joi = require('joi');
const expressErr = require('./errorHandling').ExpressError;

module.exports.validateCampground = (req, res, next) => {
    const campgroundSchema = joi.object({
        campgrounds: joi.object({
            title: joi.string().required(),
            price: joi.number().required().min(0),
            // img: joi.string().required(),
            location: joi.string().required(),
            description: joi.string().required()
        }).required(),
        deleteImg: joi.array()
    })

    const { error } = campgroundSchema.validate(req.body);
    console.log(error);

    if (error) {
        const msg = error.details.map(el => el.message).join('')
        throw new expressErr(msg, 400);
    } else {
        next()
    }
}

module.exports.validateReviews = (req, res, next) => {
    const reviewSchema = joi.object({
        review: joi.object({
            body: joi.string().required(),
            rating: joi.number().required().min(0)
        }).required()
    })

    const { error } = reviewSchema.validate(req.body);
    console.log(error);

    if (error) {
        const msg = error.details.map(el => el.message).join('')
        throw new expressErr(msg, 400);
    } else {
        next()
    }
}
