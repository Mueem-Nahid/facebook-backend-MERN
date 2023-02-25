const express = require('express');
const {authUser} = require("../middlwares/auth");
const {auth, register, activateAccount, login, sendVerificationEmail, findUser} = require('../controllers/user');

const router = express.Router();

router.post('/register', register);

router.post('/activate', authUser, activateAccount);

router.post('/login', login);

router.post('/auth', authUser, auth);

router.post('/sendVerificationEmail', authUser, sendVerificationEmail);

router.post('/findUser', findUser);

module.exports = router;