const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/profile', authController.getProfile.bind(authController));
router.post('/logout', authController.logout.bind(authController));

module.exports = router;