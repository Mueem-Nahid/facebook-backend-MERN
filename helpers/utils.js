// common function to return response
exports.sendResponse = (res, status, message, data = null) => {
   return res.status(status).json({message, data});
}

