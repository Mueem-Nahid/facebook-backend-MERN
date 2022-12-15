const express = require('express');
const {authUser} = require("../middlwares/auth");
const {auth, register, activateAccount, login} = require('../controllers/user');

const router = express.Router();

router.post('/register', register);

router.post('/activate', activateAccount);

router.post('/login', login);

router.post('/auth', authUser, auth);

module.exports = router;