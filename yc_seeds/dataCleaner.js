/* ----------------------------------------------------------------------------------
Extremely Scuffed Data Cleaner
---------------------------------------------------------------------------------- */

const mongoose = require('mongoose');
const campground = require('../yc_models/campground');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MONGOOSE DB CONNECTED");
})

async function dataCleaner() {

    let coll = await campground.find({});

    for (let obj of coll) {
        if (Object.keys(obj._doc).length < 6) {
            let result = await campground.deleteOne({ _id: `${obj._id}`});
        }

        if (obj.title == '' || obj.descrption == '' || obj.location == '' || obj.img == '' || obj.price < 0) {
            console.log(obj)
            let result = await campground.deleteOne({ _id: `${obj._id}`});
            console.log(result)
        } 
    }
    mongoose.connection.close()
}

dataCleaner();