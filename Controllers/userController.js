const User = require('../yc_models/user');

module.exports.registerUserForm = (req, res) => {
    res.render('user/register');
};

module.exports.registerUser = async(req, res, next) => {
    try {
        const { email, username, password } = req.body.user;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        // Docs req.login file:///C:\Users\keith\Desktop\udemy_WebDevBC\yelpCamp\docs\req.login
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Successfully Registered to YelpCamp');
            res.redirect('/yelpCamp')
        })  
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/register');
    }
    
};

module.exports.loginUserForm = (req, res) => {
    res.render('user/login');
};

module.exports.loginUser = (req, res) => {
    const { username } = req.body;
    // Testing if this works
    // passport.session.username = username;

    const redirectUrl = req.session.returnTo || '/yelpCamp';
    // Docs delete file:///C:\Users\keith\Desktop\udemy_WebDevBC\yelpCamp\docs\delete
    delete req.session.returnTo;

    req.flash('success', `Welcome back ${username}`);
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    // const username = passport.session.username;
    req.logout();
    req.flash('success', `User has logged out`);
    res.redirect('/yelpCamp');
};


/*
NOTE: Alternative method for loginUser 

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/yelpCamp/login' }), (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back ${username}`);
    res.redirect('/yelpCamp')
})
*/