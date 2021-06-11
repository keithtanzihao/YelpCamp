const campground = require('../yc_models/campground');
const { cloudinary } = require('../cloudinary');

const mb_GeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mb_GeoCoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
    const listOfCg = await campground.find({}).populate({
        path: 'reviews'
    });
    console.log('wut');
    res.render('campground/cg_main', { listOfCg });
};

module.exports.createCampForm = (req, res) => {
    res.render('campground/cg_new');
};
 
module.exports.createCamp = async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campgrounds.location,
        limit: 1
    }).send()

    const cg_data = new campground(req.body.campgrounds);
    cg_data.geometry = geoData.body.features[0].geometry
    cg_data.img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    cg_data.author = req.user._id;
    await cg_data.save();

    console.log(cg_data);
    req.flash('success', 'Successfully made a new campground'); 
    res.redirect(`/yelpCamp/${cg_data._id}`);
};

module.exports.fetchCamp = async (req, res) => {

    const { id } = req.params;
    const cg = await campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    console.log(`\n\n${cg.geometry.coordinates}`)

    if (!cg) {
        req.flash('error', 'Campground not found!');
        return res.redirect(`/yelpCamp`);
    }
    res.render('campground/cg_indiv', { cg });
};

module.exports.editCampForm = async (req, res) => {
    
    let cg = await campground.findById(req.params.id);
    console.log(cg);
    if (!cg) {
        req.flash('error', 'Campground not found!');
        return res.redirect(`/yelpCamp`);
    }
    res.render(`campground/cg_edit`, { cg });
};

module.exports.editCamp = async (req, res) => {

    // console.log(req.body);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campgrounds.location,
        limit: 1
    }).send()

    const cg = await campground.findByIdAndUpdate(req.params.id, { ...req.body.campgrounds });
    
    cg.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    cg.img.push(...imgs);
    await cg.save();

    if (req.body.deleteImg) {
        console.log(req.body.deleteImg);
        for (let filename of req.body.deleteImg) {
            await cloudinary.uploader.destroy(filename);
        }
        await cg.updateOne({ $pull: {
            img: {
                filename: {
                    $in: req.body.deleteImg
                }
            }
        }});
    }

    req.flash('success', 'Successfully updated a campground'); 
    res.redirect(`/yelpCamp/${cg._id}`);
};

module.exports.deleteCamp = async (req, res) => {

    const cg = await campground.findById(req.params.id);
    await campground.findByIdAndDelete(req.params.id);

    req.flash('success', 'Successfully deleted a campground'); 
    res.redirect(`/yelpCamp`);
};