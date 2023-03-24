const express = require("express");
const {authUser} = require("../middlwares/auth");
const imageUpload = require("../middlwares/imageUpload");
const {uploadImages} = require("../controllers/upload");

const router = express.Router();

router.post("/uploadImages", imageUpload, uploadImages);

module.exports = router;