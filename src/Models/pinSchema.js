const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const pinSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String,
        required : true,
        min : 3
    },
    ratings : {
        type : Number,
        required : true,
        min : 1,
        max : 5
    },
    lat : {
        type : Number,
        required : true
    },
    lon : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    }
}, { timestamps : true });

module.exports = mongoose.model('Pin', pinSchema);