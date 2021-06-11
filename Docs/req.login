
***************** req.login *****************


Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.

Note: passport.authenticate() middleware invokes req.login() automatically. This function is primarily used when users sign up, during which req.login() can be invoked to automatically log in the newly registered user.

http://www.passportjs.org/docs/login/