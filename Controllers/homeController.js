const campground = require('../yc_models/campground');

module.exports.home = async(req, res) => {
    const cg = await campground.find({});
    
    const cg_length = cg.length
    const cg_ran = Math.floor(cg_length * Math.random());

    const cg_img_length = cg[cg_ran].img.length;
    const img_ran = Math.floor(cg_img_length * Math.random());

    const img_url = cg[cg_ran].img[img_ran].url;

    // console.log(`cg ${cg_ran} cg_img ${cg_img_length}`);
    // console.log(`url: ${ img_url }`);

    res.render('./home', { img_url });
};