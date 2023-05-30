const mongoose = require("mongoose");
require("dotenv").config();

// connection to database
module.exports = connect = async () => {
    try {
        const response = await mongoose.connect(process.env.URL);
        console.log("[SUCCESS]" .green.bold + " Database connected !" .green);
    } catch (error) {
        console.log("[FAIL]" .red.bold + " Database crashed !" .red);
        console.log(error);
    }
}