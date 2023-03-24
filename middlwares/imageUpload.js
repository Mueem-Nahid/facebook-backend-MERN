const {sendResponse, removeTmpFile} = require("../helpers/utils");
const {validateImage} = require("../helpers/validation");

module.exports = async function (req, res, next) {
   try {
      // console.log("Files", Object.values(req.files).flat());
      // Object.values(req.files) will turn an obj into an array,
      // .flat() will make them into an array objects

      if (!req.files || Object.values(req.files).flat().length === 0) {
         return sendResponse(res, 400, "No file selected.");
      }
      let files = Object.values(req.files).flat();
      files.forEach((file) => {
         try {
            if (validateImage(file)) {
               console.log("File is ok");
               // Do something with the valid file here
            }
         } catch (error) {
            removeTmpFile(file.tempFilePath);
            return sendResponse(res, 500, error.message);
         }
      })
      // next();
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}