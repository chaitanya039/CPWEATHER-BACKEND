const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const contactSchema = new Schema({
    firstName : {
        type : String, 
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true 
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    attachment : {
        type : String
    },
    message : {
        type : String,
        required : true
    }
}, { timestamps : true });

module.exports = mongoose.model("Contact", contactSchema);