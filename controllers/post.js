const {sendResponse} = require("../helpers/utils");

const Post = require("../models/Post");

exports.createPost = async (req, res) => {
   try {
      const post = await new Post(req.body).save();
      return sendResponse(res, 201, "Post created", {post});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};

exports.getAllPosts = async (req, res) => {
   try {
      const posts = await Post.find();
      return sendResponse(res, 200, "All posts.", posts);
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}