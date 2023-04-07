const {sendResponse} = require("../helpers/utils");
const User = require('../models/User');
const Post = require('../models/Post');

exports.getProfile = async (req, res) => {
   try {
      const {username} = req.params;
      const userProfile = await User.findOne({username}).select("-password");
      if (!userProfile)
         return sendResponse(res, 404, "User not found.");
      const posts = await Post.find({user: userProfile._id}).populate("user");
      return sendResponse(res, 200, "User found.", {...userProfile.toObject(), posts});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}