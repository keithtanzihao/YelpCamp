
const mongoose = require('mongoose');
const campground = require('../yc_models/campground');
const review = require('../yc_models/reviews');
const user = require('../yc_models/user');

const cg_seed = require('./seedCities.js');
const cg_help = require('./seedHelpers.js');
const readline = require('readline');

// As title
const rand_Sentence = require('random-sentence');

const { cloudinary } = require('../cloudinary');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// const cg_len = cg_seed.listOfCities.length
let cg_len = 0;
const des_len = cg_help.descriptors.length;
const pl_len = cg_help.places.length;

// Random value generator
function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// User specified number of campgrounds
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Dont have to call cg_help.places or cg_help.descriptors 
const {places, descriptors} = cg_help;


// Scuffed campground generator function
const cg_generate = async function cg_gen() {

    const cg_data = await campground.find({});
    console.log(cg_data);

    console.log(process.env.CLOUDINARY_CLOUD_NAME);

    for (let cg of cg_data) {
        for(let img of cg.img) {
            console.log(img);
            if (img.filename != 'YelpCamp/m35lszpk4ymlbzskxi9f') {

                /* 
                For some odd reason using proicess.env doesnt work
                NOTE: Must substitude process.env with its actual string value.

                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_KEY,
                    api_secret: process.env.CLOUDINARY_SECRET
                });
                */
                await cloudinary.uploader.destroy(img.filename,
                    function(error, result) {console.log(`RESULT: ${result} \n ERROR:${error}`); });
            }
        }
    }

    await campground.deleteMany({});
    await review.deleteMany({});
    
    console.log(`cg_len is ${cg_len}`);

    for (let i = 0; i < cg_len; i++) {
        const cg_new = new campground({
            author: '60b089a536dbd54f2c349120',
            location: `${cg_seed.listOfCities[rand(0, cg_len)].city}, ${cg_seed.listOfCities[rand(0, cg_len)].state}`,
            title: `${descriptors[rand(0, des_len)]} ${places[rand(0, pl_len)]}`,
            price: `${rand(rand(10,20), rand(50, 100))}`,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            img: [
                {
                  url: 'https://res.cloudinary.com/keiththetan94/image/upload/v1622797831/YelpCamp/jf0087ofo4d11_ksqrvv.png',
                  filename: 'YelpCamp/jf0087ofo4d11_ksqrvv'
                }
            ],
            description: `${rand_Sentence({min: 5, max: 10})}`
        })
        console.log(cg_new);
        await cg_new.save();
    }
    console.log('done');
}

// Scuffed recursive readline function
function recursivePrompt() {
    rl.question('Number of Campgrounds: ', (num) => {
        console.log(num, parseInt(num, 10));
        if (num == parseInt(num, 10)) {
            cg_len = num;
            cg_generate();
            return;
        } else {
            console.log('Invalid Input !!');
            recursivePrompt();
        }
        console.log("crap");
    });
}

// Practise using callbacks (might be abit clunky)
function db_init(callback) {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log("MONGOOSE DB CONNECTED");
        callback();
    })  
}
db_init(recursivePrompt);
