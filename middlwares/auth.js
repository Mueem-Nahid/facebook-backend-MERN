const jwt = require("jsonwebtoken");
const {sendResponse} = require("../helpers/utils");

exports.authUser = async (req, res, next) => {
   try {
      let tmp = req.header("Authorization");
      const token = tmp ? tmp.slice(7, tmp.length) : ""; // extracting token without 'Bearer'
      if (!token)
         return sendResponse(res, 400, 'Invalid authentification.');
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
         if (err)
            return sendResponse(res, 400, 'Invalid authentification.');
         req.user = user;
         next();
      })
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};