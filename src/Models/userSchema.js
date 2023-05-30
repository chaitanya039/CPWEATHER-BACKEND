const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// define schema
// schema is overall design and definition of database...
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max : 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max : 20
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        index : true,
        unique : true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique : true,
        lowercase: true
    },
    hash_password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true,
        trim: true,
        unique : true
    },
    profilePicture: {
        type: String
    }
}, { timestamps: true });


// create virtual property

userSchema.virtual("fullName")
.get(function(){
    return `${this.firstName} ${this.lastName}`;
});

// create method for particular document for password checking
// methods is object so, use " . "

userSchema.methods.authenticate = async function (password) {
    return await bcrypt.compare(password, this.hash_password);
}

// create a collection for this schema by using class name as model
module.exports = mongoose.model("User", userSchema);
