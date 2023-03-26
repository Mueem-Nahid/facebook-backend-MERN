const express = require("express");
const {authUser} = require("../middlwares/auth");
const {createPost, getAllPosts} = require("../controllers/post");

const router = express.Router();

router.post("/createPost", authUser, createPost);

router.get("/getAllPosts", authUser, getAllPosts);

module.exports = router;