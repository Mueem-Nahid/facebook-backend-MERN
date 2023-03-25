const cloudinary = require("cloudinary");
const fs = require("fs");
const {sendResponse, removeTmpFile} = require("../helpers/utils");

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_API_KEY,
   api_secret: process.env.CLOUD_API_SECRET
});

exports.uploadImages = async (req, res) => {
   try {
      const {path} = req.body;
      let files = Object.values(req.files).flat();
      let images = [];
      for (const file of files) {
         const url = await uploadToCloudinary(file, path);
         images.push(url);
         removeTmpFile(file.tempFilePath);
      }
      sendResponse(res, 200, "Image uploaded.", {images});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};

// REUSABLE FUNCTION TO UPLOAD IMAGES INTO COULDINARY
const uploadToCloudinary = async (file, path) => {
   return new Promise((resolve) => {
      cloudinary.v2.uploader.upload(
         file.tempFilePath, {
            folder: path,
         },
         (err, res) => {
            if (err) {
               removeTmpFile(file.tempFilePath);
               console.log("Failed to upload image:", err)
               return sendResponse(res, 400, "Failed to upload image.");
            }
            resolve({
               url: res.secure_url,
            });
         }
      );
   });
};