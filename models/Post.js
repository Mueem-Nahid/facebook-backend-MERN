const mongoose = require(mongoose);
const {mongo} = require("mongoose");

const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
      type: {
         type: String,
         enum: ["profilePicture", "cover", null],
         default: null,
      },
      text: {
         type: String,
      },
      images: {
         type: Array,
      },
      user: {
         type: ObjectId,
         ref: "User",
         required: true,
      },
      background: {
         type: String,
      },
      comments: [
         {
            comment: {
               type: String,
            },
            image: {
               type: ObjectId,
            },
            commentedBy: {
               type: ObjectId,
               ref: "User",
            },
            commentedAt: {
               type: Date,
               default: new Date(),
            },
         }
      ]
   },
   {
      timestamps: true,
   });

module.exports = mongoose.model("post", postSchema);