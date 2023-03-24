const express = require("express");
const {authUser} = require("../middlwares/auth");
const {createPost} = require("../controllers/post");

const router = express.Router();

router.post("/createPost", authUser, createPost);

module.exports = router;