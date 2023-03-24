const {sendResponse} = require("../helpers/utils");

exports.uploadImages = async (req, res) => {
   try {
      return sendResponse(res, 200, "success")
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}