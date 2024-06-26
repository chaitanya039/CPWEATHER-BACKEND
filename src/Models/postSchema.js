const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const postSchema = new Schema(
    {
        title : {
            type : String,
            required : true
        },
        body : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        image : {
            type : String,
            required : true
        },
        slug : {
            type : String,
            required : true
        },
        user : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }, { timestamps : true }
);

module.exports = mongoose.model("Post", postSchema);