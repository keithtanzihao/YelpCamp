const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviews = require('./reviews');
const { cloudinary } = require('../cloudinary');

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    img: [
        {
            url: String,
            filename: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'review'
        }
    ]
}, opts);

campgroundSchema.virtual('properties').get(function () {
    return {
        id: this._id,
        title: this.title,
        descript: this.description
    }
})

campgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await reviews.deleteMany({
            _id : { $in: doc.reviews }
        })
        for (let img of doc.img) {
            console.log(process.env.CLOUDINARY_KEY , process.env.CLOUDINARY_CLOUD_NAME);
            await cloudinary.uploader.destroy(img.filename);
        }
    }
})


module.exports = mongoose.model('Campground', campgroundSchema); 

