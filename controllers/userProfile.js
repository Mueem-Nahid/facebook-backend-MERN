const {sendResponse} = require("../helpers/utils");
const User = require('../models/User');

exports.getProfile = async (req, res) => {
   try {
      const {username} = req.params;
      const userProfile = await User.find({username}).select("-password");
      if (userProfile.length)
         return sendResponse(res, 200, "User found.", userProfile);
      else
         return sendResponse(res, 404, "User not found.");
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}