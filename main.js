if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Create Express App
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { ExpressError } = require('./static/js/middleware/errorHandling');
const methodOverride = require('method-override');
// Block template for EJS
const ejsMate = require('ejs-mate');
// Routers
const yc_routes = require('./yc_routes');
// Sessions
const session = require('express-session');
// Flash
const flash = require('connect-flash');
// Passport (User Authentication)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./yc_models/user');

// For security, mongo injections $ signs, etc
const mongoSanitize = require('express-mongo-sanitize');

// Using MongoDb to store sessions instead of using memory
const MongoStore = require('connect-mongo');

// Morgon logger middleware
// const morgan = require('morgan');
// app.use(morgan('tiny'));

// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://localhost:27017/yelpCamp'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


// Top-level funciton exported by module
const app = express();
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MONGOOSE DB CONNECTED");
})

const secret = process.env.SECRET || 'Badsecret' // not sure if i should remove this

// Must be placed before routes
const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 3600 // time period in seconds
    // Cram it up the cramhole
    }).on("error", function(e) {
        console.log('SESSION STORE ERROR');
    }),
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};



// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) 
// Override with POST having ?_method=PUT / DELETE
app.use(methodOverride('_method'))
// Required to use static files like CSS
app.use(express.static(path.join(__dirname, 'static')));
app.engine('ejs', ejsMate);
// Template engine to use
app.set('view engine', 'ejs');
// Dir where files located
app.set('views', path.join(__dirname, 'yc_views'));
// Sessions
app.use(session(sessionConfig));
// Flash
app.use(flash());

// Middleware required to initialize passport
app.use(passport.initialize());
// If your application uses persistent login sessions
app.use(passport.session());
// use static authenticate method of model in LocalStrategy. Lookup (Static methods) in documentation for more info 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // Docs res.locals: file:///C:\Users\keith\Desktop\udemy_WebDevBC\yelpCamp\docs\res.locals

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

// Replaces prohibited characters with "_"
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
);

// Routers
app.use(yc_routes);



// Basic route error handling
app.all('*', (req, res, next) => {
    next(new ExpressError("PAGE NOT FOUND!", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Page Not Found';
    }
    res.status(statusCode).render('utility/error', { err });
});


// Binds & listens for connections on specific host/port
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});

