const express = require("express");
const { signup, login, admin, changePassword, forgotPassword, verifyOtp, resetPassword, verifyEmail, uploadProfileImage, getUserProfile, updateProfile, deleteProfileImage } = require("../controller/user.controller");
const loginLimiter = require("../middleware/login.limit");
const { initiateGoogleOAuth, handleGoogleCallback, unlinkGoogleAccount, setGoogleAccountPassword } = require("../controller/oauth2.controller");
const isAuthentication = require("../middleware/isAuth");
const { upload } = require("../conf/cloudinary");
const router = express.Router();

router.post('/signup', signup);
router.get('/login', loginLimiter, login);
router.patch('/admin/:userId', admin);
router.patch('/change-password/:userId', changePassword);
router.patch('/forgot-password', forgotPassword);
router.patch('/otp-verify', verifyOtp);
router.patch('/reset-password/:userId', resetPassword);
router.post('/verify-email/:emailToken', verifyEmail);

// OAuth2 routes
router.get('/google', initiateGoogleOAuth);
router.get('/google/callback', handleGoogleCallback);
router.delete('/google/unlink', isAuthentication, unlinkGoogleAccount);
router.post('/google/set-password', isAuthentication, setGoogleAccountPassword);

//profile route
router.post('/profile/upload-profile-picture', isAuthentication, upload.single('profile-picture'), uploadProfileImage);
router.get('profile/get-profile', isAuthentication, getUserProfile);
router.patch('profile/update-profile', isAuthentication, updateProfile);
router.delete('profile/delete-profile-image', isAuthentication, deleteProfileImage);

module.exports = router;