const express = require('express');
const {authUser} = require("../middlwares/auth");
const {
   auth,
   register,
   activateAccount,
   login,
   sendVerificationEmail,
   findUser,
   sendResetPasswordCode,
   validateResetPasswordCode,
   changePassword
} = require('../controllers/user');
const {getProfile, updateProfilePicture, updateCover} = require("../controllers/userProfile");

const router = express.Router();

router.post('/register', register);

router.post('/activate', authUser, activateAccount);

router.post('/login', login);

router.post('/auth', authUser, auth);

router.post('/sendVerificationEmail', authUser, sendVerificationEmail);

router.post('/findUser', findUser);

router.post('/sendResetPasswordCode', sendResetPasswordCode);

router.post('/validateResetPasswordCode', validateResetPasswordCode);

router.post('/changePassword', changePassword);

router.get('/getProfile/:username', authUser, getProfile);

router.patch('/updateProfilePicture', authUser, updateProfilePicture);

router.patch('/updateCover', authUser, updateCover);

module.exports = router;