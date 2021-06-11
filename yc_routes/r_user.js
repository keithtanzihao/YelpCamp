const express = require('express');     
const router = express.Router();

const { catchAsync} = require('../static/js/middleware/errorHandling');
const { userAuth } = require('../static/js/middleware/authValidation');

const userCtrl = require('../Controllers/userController');


router.route('/register')
    .get(userCtrl.registerUserForm)
    .post(catchAsync(userCtrl.registerUser));


router.route('/login')
    .get(userCtrl.loginUserForm)
    .post(userAuth, userCtrl.loginUser);


router.get('/logout', userCtrl.logoutUser);


module.exports = router;