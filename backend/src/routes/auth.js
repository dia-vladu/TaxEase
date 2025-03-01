const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.route('/login')
    .get(authController.checkLoginStatus) // Route for checking login status
    .post(authController.loginUser); // Route for logging in a user

// Route for logging out a user
router.post('/logout', authController.logoutUser);

module.exports = router;