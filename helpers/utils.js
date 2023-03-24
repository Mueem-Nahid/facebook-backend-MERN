// common function to return response
const fs = require("fs");

exports.sendResponse = (res, status, message, data = null) => {
   return res.status(status).json({message, data});
}

exports.removeTmpFile = (filePath) => {
   fs.unlink(filePath, err => {
      if (err) throw err;
   })
}
