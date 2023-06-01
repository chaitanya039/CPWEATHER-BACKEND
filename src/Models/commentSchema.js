const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const commentSchema = new Schema({
    postId : {
        type : Schema.Types.ObjectId,
        ref : "Post"
    },
    comment : {
        type : String,
        required : true
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, { timestamps : true });

module.exports = mongoose.model("Comment", commentSchema);