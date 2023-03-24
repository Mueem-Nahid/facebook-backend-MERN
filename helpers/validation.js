const User = require("../models/User");

exports.validateEmail = (email) => {
   return String(email).toLowerCase().match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

exports.validateLength = (text, min, max) => {
   return !(text.length > max || text.length < min);
}

exports.validateUsername = async (username) => {
   let a = false;
   do {
      let check = await User.findOne({username});
      if (check) {
         // change username
         username += (+new Date() * Math.random()).toString().substring(0, 1);
         a = true;
      } else {
         a = false;
      }
   } while (a)
   return username;
}

exports.validateImage = (file) => {
   const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
   const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

   if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("File type not supported");
   }
   if (file.size > maxFileSize) {
      throw new Error("File size is more than 2mb");
   }
   return true;
}